

(function(){
  // Manage Bookings page render
  const bookingTable = document.getElementById('bookingTable');
  if(bookingTable){
    (async () => {
      const list = await API.getVendorBookings(1, 50);
      const tbody = bookingTable.querySelector('tbody');
      function fmt(dt){ try{ return dt ? new Date(dt).toLocaleString('vi-VN') : '—'; }catch{ return '—'; } }
      function vnd(n){ return (Number(n)||0).toLocaleString('vi-VN',{style:'currency',currency:'VND'}); }
      tbody.innerHTML = (list||[]).map(b => `
        <tr data-id="${b.id}">
          <td>${b.code}</td>
          <td>${b.customer}</td>
          <td>${b.contact}</td>
          <td>${b.route}</td>
          <td>${fmt(b.depAt)}</td>
          <td>${b.vehicle}</td>
          <td>${b.plate}</td>
          <td>${(b.seatList && b.seatList.length) ? b.seatList.join(', ') : b.seats}</td>
          <td>${vnd(b.total)}</td>
          <td>${renderStatus(b.status)}</td>
          <td>
            <button class="icon-btn edit-booking" title="Sửa vé"><i class="ri-pencil-line"></i></button>
            <button class="icon-btn delete-booking" title="Huỷ vé"><i class="ri-forbid-2-line"></i></button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="11" class="muted">Chưa có vé nào</td></tr>';
    })();
  }

  document.addEventListener('click', async (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if(openBtn){
      const sel = openBtn.getAttribute('data-open-modal');
      const modal = document.querySelector(sel);
      if(modal){ modal.setAttribute('aria-hidden','false'); }
    }
    if(e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')){
      const modal = e.target.closest('.modal');
      if(modal){ modal.setAttribute('aria-hidden','true'); }
    }
    const delBookingBtn = e.target.closest('.delete-booking');
    const editBookingBtn = e.target.closest('.edit-booking');
    if(delBookingBtn){
      const tr = delBookingBtn.closest('tr');
      const id = tr?.getAttribute('data-id');
      if(id && confirm('Huỷ vé này?')){
        const rs = await API.deleteBooking(id);
        if(rs && rs.ok){ tr.remove(); } else { alert(rs && rs.error || 'Huỷ vé thất bại'); }
      }
    } else if(editBookingBtn){
      const tr = editBookingBtn.closest('tr');
      const id = tr?.getAttribute('data-id');
      const modal = document.getElementById('editBookingModal');
      const form = document.getElementById('editBookingForm');
      form.id.value = id;
      // fetch booking detail to build seat grid
      try {
        const detail = await API.request ? API.request(`/vendor/bookings/${id}`, { headers: {} }) : null;
      } catch {}
      // fetch stops
      const stops = await API.getAllStops();
      const pickupSel = document.getElementById('pickupStopSel');
      const dropoffSel = document.getElementById('dropoffStopSel');
      const options = ['<option value="">-- Chọn --</option>'].concat((stops||[]).map(s => `<option value="${s.id}">${s.name}</option>`)).join('');
      if(pickupSel) pickupSel.innerHTML = options;
      if(dropoffSel) dropoffSel.innerHTML = options;
      // Build seat grid from seat_map if available via hidden cache on row (fallback to API if needed)
      try {
        const res = await fetch((window.API_BASE_URL||'http://127.0.0.1:8000/api').replace(/\/$/,'')+`/vendor/bookings/${id}`, { headers: { 'Authorization': 'Bearer '+(localStorage.getItem('API_TOKEN')||'') } });
        const json = await res.json();
        const payload = json && (json.data ?? json);
        const grid = document.getElementById('seatGrid');
        if(grid && payload && Array.isArray(payload.seat_map)){
          const taken = new Set((payload.seats||[]).map(s => s.id));
          grid.innerHTML = payload.seat_map.map(seat => {
            const st = (seat.status||'').toLowerCase();
            const booked = st !== 'available' && !taken.has(seat.id);
            const cls = booked ? 'seat booked' : 'seat available';
            const checked = taken.has(seat.id) ? 'checked' : '';
            const disabled = booked ? 'disabled' : '';
            return `<label class="${cls}"><input type="checkbox" name="seat_ids[]" value="${seat.id}" ${checked} ${disabled} />${seat.seat_number}</label>`;
          }).join('');
        }
      } catch {}
      modal.setAttribute('aria-hidden','false');
    }
  });
  const editBookingForm = document.getElementById('editBookingForm');
  editBookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(editBookingForm);
    const id = fd.get('id');
    const payload = {};
    const status = fd.get('status');
    const pickup = fd.get('pickup_stop_id');
    const dropoff = fd.get('dropoff_stop_id');
    if(status) payload.status = status;
    if(pickup) payload.pickup_stop_id = Number(pickup);
    if(dropoff) payload.dropoff_stop_id = Number(dropoff);
    const rs = await API.updateBooking(id, payload);
    if(rs && rs.ok){
      document.getElementById('editBookingModal')?.setAttribute('aria-hidden','true');
      const tbody = document.querySelector('#bookingTable tbody');
      const list = await API.getVendorBookings(1, 50);
      function fmt(dt){ try{ return dt ? new Date(dt).toLocaleString('vi-VN') : '—'; }catch{ return '—'; } }
      function vnd(n){ return (Number(n)||0).toLocaleString('vi-VN',{style:'currency',currency:'VND'}); }
      tbody.innerHTML = (list||[]).map(b => `
        <tr data-id="${b.id}">
          <td>${b.code}</td>
          <td>${b.customer}</td>
          <td>${b.contact}</td>
          <td>${b.route}</td>
          <td>${fmt(b.depAt)}</td>
          <td>${b.vehicle}</td>
          <td>${b.plate}</td>
          <td>${(b.seatList && b.seatList.length) ? b.seatList.join(', ') : b.seats}</td>
          <td>${vnd(b.total)}</td>
          <td>${renderStatus(b.status)}</td>
          <td>
            <button class="icon-btn edit-booking" title="Sửa vé"><i class="ri-pencil-line"></i></button>
            <button class="icon-btn delete-booking" title="Huỷ vé"><i class="ri-forbid-2-line"></i></button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="11" class="muted">Chưa có vé nào</td></tr>';
    } else {
      alert(rs && rs.error || 'Cập nhật vé thất bại');
    }
  });

  if(document.getElementById('yearHistoryChart')){
    API.getDashboard().then(d => {
      Charts.yearHistory(document.getElementById('yearHistoryChart'), d.yearHistory);
      Charts.weekActivity(
        document.getElementById('weekActivityChart'),
        d.weekActivity.labels,
        d.weekActivity.booked,
        d.weekActivity.canceled
      );
      Charts.seatPie(
        document.getElementById('seatPieChart'),
        d.seatToday.labels,
        d.seatToday.values
      );
    });
    const vendorNameEl = document.getElementById('vendorName');
    if(vendorNameEl){
      API.getVendorInfo().then(info => {
        if(info && (info.company_name || (info.owner && info.owner.name))){
          vendorNameEl.textContent = info.company_name || info.owner.name;
        }
        const avatar = document.getElementById('vendorAvatar');
        if(avatar && info && info.logo_url){
          avatar.innerHTML = `<img src="${info.logo_url}" alt="logo"/>`;
        }
      });
    }
  }
  const ticketTable = document.getElementById('ticketTable');
  if(ticketTable){
    (async () => {
      const form = document.getElementById('ticketForm');
      const tbody = ticketTable.querySelector('tbody');
      const prevBtn = document.getElementById('prevPage');
      const nextBtn = document.getElementById('nextPage');
      const pageInfo = document.getElementById('pageInfo');
      const perPageSel = document.getElementById('perPageSel');
      const vehicleTypeFilter = document.getElementById('vehicleTypeFilter');

      let state = { page: 1, perPage: Number(perPageSel?.value || 20), filter: { vehicle_type: '' } };

      function renderTickets(list){
        tbody.innerHTML = (list||[]).map(t => `
          <tr data-trip-id="${t.id}">
            <td>${t.vehicle}</td>
            <td>${t.type}</td>
            <td>${t.plate}</td>
            <td>${(Number.isFinite(t.available)?t.available:'—')}/${(Number.isFinite(t.capacity)?t.capacity:'—')}</td>
            <td>${t.time}</td>
            <td>${t.date}</td>
            <td>${t.route}</td>
            <td>${renderPriceCell(t)}</td>
            <td>${renderStatus(t.status)}</td>
            <td>
              <button class="icon-btn edit-trip" title="Sửa"><i class="ri-pencil-line"></i></button>
              <button class="icon-btn delete-trip" title="Huỷ chuyến"><i class="ri-forbid-2-line"></i></button>
              <button class="icon-btn hard-delete-trip" title="Xoá vé"><i class="ri-delete-bin-6-line"></i></button>
            </td>
          </tr>`).join('') || '<tr><td colspan="10" class="muted">Chưa có dữ liệu</td></tr>';
      }

      function renderPager(meta){
        if(!pageInfo || !prevBtn || !nextBtn) return;
        const cur = Number(meta?.current_page || state.page);
        const last = Number(meta?.last_page || cur);
        pageInfo.textContent = `Trang ${cur}/${last}`;
        prevBtn.disabled = cur <= 1;
        nextBtn.disabled = cur >= last;
      }

      async function loadTickets(){
        const { items, meta } = await API.getTickets(state.page, state.perPage, state.filter);
        renderTickets(items);
        renderPager(meta);
      }

      const [vehicles, cities] = await Promise.all([API.getVehicles(), API.getCities()]);
      await loadTickets();

      const vehicleSel = form.querySelector('select[name="vehicleId"]');
      vehicleSel.innerHTML = vehicles.map(v => `<option value="${v.id}" data-type="${v.type}">${v.name}</option>`).join('');
      const fromSel = form.querySelector('select[name="fromCity"]');
      const toSel = form.querySelector('select[name="toCity"]');
      fromSel.innerHTML = toSel.innerHTML = cities.map(c => `<option>${c}</option>`).join('');

      function syncTicketPriceFields(){
        const opt = vehicleSel.options[vehicleSel.selectedIndex];
        const type = (opt && opt.getAttribute('data-type')) || '';
        const showTrain = String(type).toLowerCase() === 'train';
        document.getElementById('trainPriceFields').style.display = showTrain ? '' : 'none';
        document.getElementById('basePriceField').style.display = showTrain ? 'none' : '';
      }
      vehicleSel.addEventListener('change', syncTicketPriceFields);
      syncTicketPriceFields();

      perPageSel?.addEventListener('change', async () => {
        state.perPage = Number(perPageSel.value || 20);
        state.page = 1;
        await loadTickets();
      });
      prevBtn?.addEventListener('click', async () => {
        if(state.page > 1){ state.page -= 1; await loadTickets(); }
      });
       nextBtn?.addEventListener('click', async () => {
         state.page += 1; await loadTickets();
       });

       vehicleTypeFilter?.addEventListener('change', async () => {
         state.filter.vehicle_type = vehicleTypeFilter.value || '';
         state.page = 1;
         await loadTickets();
       });


      ticketTable.addEventListener('click', async (e) => {
        const delBtn = e.target.closest('.delete-trip');
        const hardBtn = e.target.closest('.hard-delete-trip');
        const editBtn = e.target.closest('.edit-trip');
        const tr = e.target.closest('tr');
        const id = tr && tr.getAttribute('data-trip-id');
        if(delBtn && id){
          if(confirm('Huỷ chuyến này (không xoá khỏi DB)?')){
            const rs = await API.deleteTrip(id);
            if(rs && rs.ok){
              const statusCell = tr.children[8];
              if(statusCell){ statusCell.innerHTML = renderStatus('cancelled'); }
            } else { alert(rs && rs.error || 'Huỷ chuyến thất bại'); }
          }
        } else if(hardBtn && id){
          if(confirm('Xoá vé này khỏi DB?')){
            const rs = await API.deleteTicket(id);
            if(rs && rs.ok){ await loadTickets(); } else { alert(rs && rs.error || 'Xoá vé thất bại'); }
          }
        } else if(editBtn && id){
          const row = {
            time: tr.children[4]?.textContent || '',
            date: tr.children[5]?.textContent || '',
            type: tr.children[1]?.textContent || ''
          };
          const editModal = document.getElementById('editTicketModal');
          const editForm = document.getElementById('editTicketForm');
          editForm.id.value = id;
          const isTrain = String(row.type).toLowerCase()==='train';
          document.getElementById('editTrainPrices').style.display = isTrain ? '' : 'none';
          document.getElementById('editBasePrice').style.display = isTrain ? 'none' : '';
          editModal.setAttribute('aria-hidden','false');
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());
        const dep = payload.depTime || '';
        const arr = payload.arrTime || '';
        if(dep && arr){ payload.startTime = `${dep}-${arr}`; }
        delete payload.depTime; delete payload.arrTime;
        if(payload.price !== undefined && payload.price !== ''){ payload.price = Number(payload.price); } else { delete payload.price; }
        if(payload.regular_price !== undefined && payload.regular_price !== ''){ payload.regular_price = Number(payload.regular_price); }
        if(payload.vip_price !== undefined && payload.vip_price !== ''){ payload.vip_price = Number(payload.vip_price); }
        const res = await API.createTicket(payload);
        if(res && res.ok){
          alert('Tạo vé thành công');
          document.getElementById('ticketModal').setAttribute('aria-hidden','true');
          state.page = 1; // quay lại trang đầu để thấy vé mới
          await loadTickets();
        } else {
          alert(res && res.error ? res.error : 'Tạo vé chưa được hỗ trợ trong phiên bản này.');
        }
      });
    })();
  }

  const transferGroups = document.getElementById('transferGroups');
  if(transferGroups){
    const typeSel = document.getElementById('transferTypeFilter');
    const summary = document.getElementById('transferSummary');
    function renderGroups(groups){
      const html = (Array.isArray(groups) ? groups : []).map(g => {
        const stops = (g.stops || []);
        const items = stops.map((s) => `
          <li data-stop-id="${s.id}">
            <span>${s.name || s.address || ('#'+s.id)}</span>
            <div class="chip-actions">
              <button class="icon-btn edit-stop" title="Sửa" data-id="${s.id}"><i class="ri-pencil-line"></i></button>
              <button class="icon-btn delete-stop" title="Xoá" data-id="${s.id}"><i class="ri-delete-bin-6-line"></i></button>
            </div>
          </li>`).join('');
        return `
          <div class="transfer-card">
            <div class="header">
              <div class="city">${g.city}</div>
              <button class="btn add-stop" data-city="${g.city}"><i class="ri-add-circle-line"></i> Thêm</button>
            </div>
            <ul>${items || '<li class="empty">(Chưa có điểm trung chuyển)</li>'}</ul>
          </div>`;
      }).join('');
      transferGroups.innerHTML = html || '<div class="muted">Chưa có dữ liệu trung chuyển.</div>';
      const total = (Array.isArray(groups) ? groups : []).reduce((sum,g)=> sum + ((g.stops||[]).length), 0);
      if(summary){ summary.textContent = `${total} điểm (${(typeSel?.value||'bus')==='train'?'tàu hoả':'xe khách'})`; }
    }

    async function reload(){
      const t = typeSel?.value || 'bus';
      const groups = await API.getTransfers(t);
      renderGroups(groups);
    }

    Promise.all([API.getTransfers('bus'), API.getCities()]).then(([groups, cities]) => {
      const mapByCity = new Map((groups||[]).map(g => [String(g.city).toLowerCase(), g]));
      const merged = (cities||[]).map(c => {
        const key = String(c).toLowerCase();
        return mapByCity.get(key) || { city: c, stops: [] };
      });
      renderGroups(merged);
      const form = document.getElementById('transferForm');
      const citySel = form.querySelector('select[name="city"]');
      citySel.innerHTML = cities.map(c => `<option>${c}</option>`).join('');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = Object.fromEntries(new FormData(form).entries());
        payload.transport_type = typeSel?.value || 'bus';
        const res = await API.createTransfer(payload);
        if(res && res.ok){
          document.getElementById('transferModal').setAttribute('aria-hidden','true');
          await reload();
        } else {
          alert(res && res.error || 'Tạo thất bại');
        }
      });
      const editForm = document.getElementById('editStopForm');
      document.addEventListener('click', async (e) => {
        const del = e.target.closest('.delete-stop');
        const edit = e.target.closest('.edit-stop');
        const add = e.target.closest('.add-stop');
        if(del){
          const id = del.getAttribute('data-id');
          if(id && confirm('Xoá điểm trung chuyển này?')){
            const rs = await API.deleteTransfer(id);
            if(rs && rs.ok){ await reload(); } else { alert(rs && rs.error || 'Xoá thất bại'); }
          }
        } else if(edit){
          const id = edit.getAttribute('data-id');
          editForm.id.value = id;
          const chip = edit.closest('.chip');
          const nameText = chip?.querySelector('span')?.textContent || '';
          editForm.name.value = nameText;
          editForm.address.value = nameText;
          document.getElementById('editStopModal').setAttribute('aria-hidden','true');
        } else if(add){
          const city = add.getAttribute('data-city');
          if(city){
            citySel.value = city;
            document.getElementById('transferModal').setAttribute('aria-hidden','false');
          }
        }
      });

      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(editForm);
        const id = fd.get('id');
        const body = { name: fd.get('name'), address: fd.get('address') };
        const rs = await API.updateTransfer(id, body);
        if(rs && rs.ok){
          document.getElementById('editStopModal').setAttribute('aria-hidden','true');
          await reload();
        } else {
          alert(rs && rs.error || 'Cập nhật thất bại');
        }
      });

      typeSel?.addEventListener('change', reload);
    });

  }

  const vehicleTable = document.getElementById('vehicleTable');
  if(vehicleTable){
    function renderVehicles(list){
      const tbody = vehicleTable.querySelector('tbody');
      tbody.innerHTML = (list||[]).map((v, idx) => `
        <tr data-id="${v.id}" data-name="${v.name}" data-type="${v.type}">
          <td>${idx+1}</td>
          <td>${v.name}</td>
          <td>${v.type}</td>
          <td>${v.seats}</td>
          <td>
            <button class="icon-btn edit-vehicle" title="Sửa"><i class="ri-pencil-line"></i></button>
            <button class="icon-btn delete-vehicle" title="Xoá"><i class="ri-delete-bin-6-line"></i></button>
          </td>
        </tr>`).join('');
    }

    API.getVehicles().then(renderVehicles);
    const editModal = document.getElementById('editVehicleModal');
    const editForm = document.getElementById('editVehicleForm');
    vehicleTable.addEventListener('click', async (e) => {
      const btn = e.target.closest('.edit-vehicle');
      if(!btn) return;
      const tr = btn.closest('tr');
      const id = tr.getAttribute('data-id');
      editForm.id.value = id;
      const detail = await API.getVehicle(id);
      editForm.name.value = detail?.name || tr.getAttribute('data-name') || '';
      editForm.vehicle_type.value = detail?.vehicle_type || tr.getAttribute('data-type') || 'bus';
      editForm.license_plate.value = detail?.license_plate || '';
      const editTrainSec = document.getElementById('editTrainSection');
      const coachTbody = document.querySelector('#existingCoachTable tbody');
      if((detail?.vehicle_type || '').toLowerCase() === 'train' && Array.isArray(detail?.coaches)){
        editTrainSec.style.display = '';
        coachTbody.innerHTML = detail.coaches.map(c => `
          <tr data-coach-id="${c.id}">
            <td>${c.identifier}</td>
            <td>${c.coach_type === 'seat_VIP' ? 'Ghế VIP' : 'Ghế mềm'}</td>
            <td>${c.total_seats}</td>
            <td><button type="button" class="icon-btn remove-existing-coach" title="Xoá"><i class="ri-delete-bin-6-line"></i></button></td>
          </tr>`).join('');
      } else {
        editTrainSec.style.display = 'none';
        coachTbody.innerHTML = '';
      }
      editModal.setAttribute('aria-hidden','false');
    });
    const editCoachTableBody = document.querySelector('#editCoachTable tbody');
    const editAddCoachBtn = document.getElementById('editAddCoachBtn');
    function editAddCoachRow(row={ coach_type:'seat_soft', quantity:1 }){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <select class="coach_type">
            <option value="seat_soft" ${row.coach_type==='seat_soft'?'selected':''}>Ghế mềm (40)</option>
            <option value="seat_VIP" ${row.coach_type==='seat_VIP'?'selected':''}>Ghế VIP (24)</option>
          </select>
        </td>
        <td><input type="text" class="total_seats" value="${row.coach_type==='seat_VIP'?24:40}" readonly /></td>
        <td><input type="number" class="quantity" min="1" value="${row.quantity}" /></td>
        <td><button type="button" class="icon-btn remove-edit-row" title="Bỏ"><i class="ri-close-line"></i></button></td>
      `;
      editCoachTableBody.appendChild(tr);
      const sel = tr.querySelector('.coach_type');
      const seatInput = tr.querySelector('.total_seats');
      sel.addEventListener('change', () => { seatInput.value = sel.value==='seat_VIP' ? 24 : 40; });
    }
    editAddCoachBtn?.addEventListener('click', () => editAddCoachRow());
    editCoachTableBody?.addEventListener('click', (e) => {
      if(e.target.closest('.remove-edit-row')){ e.target.closest('tr')?.remove(); }
    });
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.remove-existing-coach');
      if(!btn) return;
      const tr = btn.closest('tr');
      const coachId = tr?.getAttribute('data-coach-id');
      const vehicleId = editForm.id.value;
      if(coachId && vehicleId && confirm('Xoá toa này?')){
        const rs = await API.removeVehicleCoach(vehicleId, coachId);
        if(rs && rs.ok){ tr.remove(); } else { alert(rs && rs.error || 'Xoá toa thất bại'); }
      }
    });

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(editForm);
      const id = fd.get('id');
      const payload = {
        name: fd.get('name'),
        vehicle_type: fd.get('vehicle_type'),
        license_plate: fd.get('license_plate') || null,
      };
      const rs = await API.updateVehicle(id, payload);
      if(!(rs && rs.ok)){
        return alert(rs && rs.error || 'Cập nhật phương tiện thất bại');
      }
      const rows = Array.from(editCoachTableBody?.querySelectorAll('tr') || []);
      if(rows.length){
        const coaches = rows.map(r => ({ coach_type: r.querySelector('.coach_type').value, quantity: Number(r.querySelector('.quantity').value||1) }))
                            .filter(c => c.quantity>0);
        if(coaches.length){
          const addRs = await API.addVehicleCoaches(id, coaches);
          if(!(addRs && addRs.ok)){
            return alert(addRs && addRs.error || 'Thêm toa thất bại');
          }
        }
      }
      editModal.setAttribute('aria-hidden','true');
      const list = await API.getVehicles();
      renderVehicles(list);
    });
    const form = document.getElementById('vehicleForm');
    const vehicleTypeSel = form.querySelector('select[name="vehicle_type"]');
    const busFields = document.getElementById('busFields');
    const trainFields = document.getElementById('trainFields');
    const coachTableBody = document.querySelector('#coachTable tbody');
    const addCoachBtn = document.getElementById('addCoachBtn');

    function syncTypeVisibility(){
      const t = vehicleTypeSel.value;
      busFields.style.display = (t === 'bus') ? '' : 'none';
      trainFields.style.display = (t === 'train') ? '' : 'none';
    }
    vehicleTypeSel.addEventListener('change', syncTypeVisibility);
    syncTypeVisibility();

    function addCoachRow(row={ coach_type:'seat_soft', quantity:1 }){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <select class="coach_type">
            <option value="seat_soft" ${row.coach_type==='seat_soft'?'selected':''}>Ghế mềm (40)</option>
            <option value="seat_VIP" ${row.coach_type==='seat_VIP'?'selected':''}>Ghế VIP (24)</option>
          </select>
        </td>
        <td>
          <input type="text" class="total_seats" value="${row.coach_type==='seat_VIP'?24:40}" readonly />
        </td>
        <td><input type="number" class="quantity" min="1" value="${row.quantity}" /></td>
        <td><button type="button" class="icon-btn remove-coach" title="Xoá"><i class="ri-delete-bin-6-line"></i></button></td>
      `;
      coachTableBody.appendChild(tr);
      const sel = tr.querySelector('.coach_type');
      const seatInput = tr.querySelector('.total_seats');
      sel.addEventListener('change', () => { seatInput.value = sel.value==='seat_VIP' ? 24 : 40; });
    }
    if(addCoachBtn){ addCoachBtn.addEventListener('click', () => addCoachRow()); }
    coachTableBody?.addEventListener('click', (e) => {
      if(e.target.closest('.remove-coach')){
        const tr = e.target.closest('tr');
        tr && tr.remove();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const vehicle_type = fd.get('vehicle_type');
      const name = (fd.get('name')||'').toString().trim();
      const license_plate = (fd.get('license_plate')||'').toString().trim() || null;

      let payload;
      if(vehicle_type === 'bus'){
        const coach_type = fd.get('bus_coach_type');
        const total_seats = Number(fd.get('bus_total_seats')||0);
        payload = { name, vehicle_type, license_plate, coach: { coach_type, total_seats } };
      } else {
        const rows = Array.from(coachTableBody?.querySelectorAll('tr') || []);
        const coaches = rows.map(r => ({
          coach_type: r.querySelector('.coach_type').value,
          quantity: Number(r.querySelector('.quantity').value||1)
        })).filter(c => c.quantity>0);
        if(!coaches.length){ return alert('Vui lòng thêm ít nhất 1 toa cho tàu hoả'); }
        payload = { name, vehicle_type, license_plate: null, coaches };
      }

      const res = await API.createVehicle(payload);
      if(res && res.ok){
        alert('Tạo phương tiện thành công');
        document.getElementById('vehicleModal').setAttribute('aria-hidden','true');
        const list = await API.getVehicles();
        renderVehicles(list);
      } else {
        alert(res && res.error ? res.error : 'Không thể tạo phương tiện');
      }
    });
    vehicleTable.addEventListener('click', async (e) => {
      const btn = e.target.closest('.delete-vehicle');
      if(!btn) return;
      const tr = btn.closest('tr');
      const id = tr && tr.getAttribute('data-id');
      if(id && confirm('Bạn chắc chắn xoá phương tiện này?')){
        const res = await API.deleteVehicle(id);
        if(res && res.ok){
          const list = await API.getVehicles();
          renderVehicles(list);
        } else {
          alert(res && res.error || 'Xoá thất bại');
        }
      }
    });
  }
})();

function formatCurrency(value){
  return (Number(value) || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function renderPriceCell(t){
  if(t && t.type && t.type.toLowerCase() === 'train' && t.price && typeof t.price === 'object'){
    const reg = t.price.regular != null ? formatCurrency(t.price.regular) : '—';
    const vip = t.price.vip != null ? formatCurrency(t.price.vip) : '—';
    return `<div class="price-col"><div>Thường: ${reg}</div><div>VIP: ${vip}</div></div>`;
  }
  return formatCurrency(t && t.price);
}

function renderStatus(status){
  const s = String(status || '').toLowerCase();
  const label = s === 'cancelled' ? 'Đã huỷ' : (s === 'scheduled' ? 'Đang chạy' : status || '—');
  const cls = s === 'cancelled' ? 'badge danger' : (s === 'scheduled' ? 'badge success' : 'badge');
  return `<span class="${cls}">${label}</span>`;
}


