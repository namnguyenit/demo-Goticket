

const API = (() => {
  let baseURL = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : 'http://127.0.0.1:8000/api';
  const getToken = () => (typeof window !== 'undefined' && window.API_TOKEN) ? window.API_TOKEN : (localStorage.getItem('API_TOKEN') || '');
  let locationCache = [];

  function authHeaders(json = true){
    const headers = {};
    if(json) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if(token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async function request(path, options = {}){
    baseURL = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : baseURL;
    const url = baseURL.replace(/\/$/, '') + '/' + path.replace(/^\//,'');
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if(!res.ok){
      if(res.status === 401 || res.status === 403){
        try { localStorage.removeItem('API_TOKEN'); } catch {}
        if(typeof window !== 'undefined'){ window.API_TOKEN = ''; if(location.pathname !== '/login'){ location.href = '/login'; } }
      }
      const message = (data && (data.message || data.error || data.errors)) || `HTTP ${res.status}`;
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
    return (data && Object.prototype.hasOwnProperty.call(data, 'data')) ? data.data : data;
  }

  function toISO(date){
    try { return new Date(date).toISOString(); } catch { return null; }
  }

  function mapDashboard(payload){
    const demo = {
      yearHistory: [120, 300, 250, 400, 750, 280, 560, 320, 480, 130, 500, 460],
      weekActivity: { labels: ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'], booked: [240,80,320,470,150,400,380], canceled: [120,50,200,350,90,260,300] },
      seatToday: { labels: ['Đặt','Trống','Bán','Giữ','Tạm'], values: [35,20,15,10,20] }
    };
    if(!payload || typeof payload !== 'object') return demo;
    return {
      yearHistory: payload.yearHistory || payload.year_history || demo.yearHistory,
      weekActivity: {
        labels: (payload.weekLabels || payload.week_labels || demo.weekActivity.labels),
        booked: (payload.weekBooked || payload.week_booked || demo.weekActivity.booked),
        canceled: (payload.weekCanceled || payload.week_canceled || demo.weekActivity.canceled)
      },
      seatToday: payload.seatToday || demo.seatToday
    };
  }

  return {
    setBaseUrl(url){ baseURL = url; if(typeof window !== 'undefined'){ window.API_BASE_URL = url; localStorage.setItem('API_BASE_URL', url);} },
    setToken(token){ if(typeof window !== 'undefined'){ window.API_TOKEN = token; localStorage.setItem('API_TOKEN', token);} },

    async uploadVendorLogo(file){
      try {
        baseURL = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : baseURL;
        const url = baseURL.replace(/\/$/, '') + '/vendor/dashboard/logo';
        const fd = new FormData();
        fd.append('logo', file);
        const headers = {};
        const token = getToken();
        if(token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(url, { method: 'POST', headers, body: fd });
        const data = await res.json().catch(()=>({}));
        if(!res.ok){ throw new Error(data?.message || `HTTP ${res.status}`); }
        const payload = (data && Object.prototype.hasOwnProperty.call(data,'data')) ? data.data : data;
        return { ok: true, data: payload };
      } catch(e){ return { ok:false, error: e.message }; }
    },

    async getDashboard(){
      try {
        const payload = await request('/vendor/dashboard/stats', { headers: authHeaders(false) });
        return mapDashboard(payload);
      } catch (e){
        console.warn('Dashboard API fallback:', e.message);
        return mapDashboard(null);
      }
    },

    async getVendorInfo(){
      try {
        const data = await request('/vendor/dashboard/info', { headers: authHeaders(false) });
        return data; // { id, company_name, ... }
      } catch(e){
        console.warn('Vendor info fallback:', e.message);
        return null;
      }
    },

    async getTickets(page=1, perPage=20, filter={}){
      try {
        const params = new URLSearchParams({ per_page: String(perPage), page: String(page) });
        if(filter && filter.vehicle_type && (filter.vehicle_type==='bus' || filter.vehicle_type==='train')){
          params.set('vehicle_type', filter.vehicle_type);
        }
        const resp = await request(`/vendor/trips?${params.toString()}`, { headers: authHeaders(false) });
        const list = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
        const mapped = list.map(t => {
          const dep = t.departure_datetime ? new Date(t.departure_datetime) : null;
          const arr = t.arrival_datetime ? new Date(t.arrival_datetime) : null;
          const time = (dep && arr) ? `${dep.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}-${arr.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}` : '—';
          const date = dep ? dep.toLocaleDateString('vi-VN') : '—';
          const vehicle = t.vehicle || {};
           const route = (t.route && (t.route.label || ((t.route.origin && t.route.destination) ? `${t.route.origin} - ${t.route.destination}` : ''))) || '—';
           const computedCapacity = Array.isArray(t.coaches) ? t.coaches.reduce((sum,c)=>sum+(Number(c.total_seats)||0),0) : null;
           const capacity = Number.isFinite(t.capacity) ? t.capacity : computedCapacity;
           const available = Number.isFinite(t.empty_number) ? t.empty_number : null;
           const isTrain = (vehicle.vehicle_type || '').toLowerCase() === 'train';
           const regular = t.train_prices?.regular ?? null;
           const vip = t.train_prices?.vip ?? null;
           return {
             id: t.id,
             vehicle: vehicle.name || '—',
             type: vehicle.vehicle_type || '—',
             plate: vehicle.license_plate || '—',
             seats: (capacity ?? '—'),
             capacity: capacity ?? null,
             available: available,
             time,
             date,
             route,
             price: isTrain ? { regular, vip } : (t.base_price || 0),
             status: t.status || '—'
           };
        });
        const meta = resp?.meta || { current_page: page, last_page: page, per_page: perPage, total: mapped.length };
        return { items: mapped, meta };
      } catch (e){
        console.warn('Trips API fallback:', e.message);
        return { items: [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 } };
      }
    },

    async createTicket(payload){
      try {
        const body = {
          vehicle_id: Number(payload.vehicleId),
          start_time: String(payload.startTime||'').trim(),
          start_date: String(payload.startDate||'').trim(),
          from_city: String(payload.fromCity||'').trim(),
          to_city: String(payload.toCity||'').trim()
        };
        if(payload.price !== undefined && payload.price !== ''){
          body.price = Number(payload.price);
        }
        if(payload.regular_price !== undefined && payload.regular_price !== ''){
          body.regular_price = Number(payload.regular_price);
        }
        if(payload.vip_price !== undefined && payload.vip_price !== ''){
          body.vip_price = Number(payload.vip_price);
        }
        const data = await request('/vendor/tickets', { method: 'POST', headers: authHeaders(true), body: JSON.stringify(body) });
        return { ok:true, id: data.id, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

     async getTransfers(transport_type){
      try {
        const path = transport_type && (transport_type==='bus' || transport_type==='train') ? `/vendor/stops/by-location?transport_type=${transport_type}` : '/vendor/stops/by-location';
        const grouped = await request(path, { headers: authHeaders(false) });

        if(Array.isArray(grouped)){
          return grouped.map(g => ({ location_id: g.location_id || g.id, city: g.location_name || g.city || 'Không rõ', stops: Array.isArray(g.stops) ? g.stops : [] }));
        }
        if(grouped && typeof grouped === 'object'){
          return Object.entries(grouped).map(([city, stops]) => ({ location_id: undefined, city, stops: Array.isArray(stops) ? stops : [] }));
        }
        return [];
      } catch(e){
        console.warn('Stops by-location fallback:', e.message);
        return [];
      }
    },

    async createTransfer(payload){
      const { city, point } = payload || {};
      if(!city || !point){ return { ok:false, error: 'Thiếu thành phố hoặc điểm trung chuyển' }; }
      if(!locationCache.length){ await this.getCities(); }
      const match = locationCache.find(l => (l.name || '').toLowerCase() === String(city).toLowerCase());
      if(!match){ return { ok:false, error: 'Không tìm thấy thành phố trong danh sách' }; }
      try {
        const body = { name: point, address: point, location_id: match.id };
        const data = await request('/vendor/stops', { method: 'POST', headers: authHeaders(true), body: JSON.stringify(body) });
        return { ok: true, id: data.id, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async updateTransfer(id, payload){
      try {
        let body = { ...payload };
        if(!body.location_id && body.city){
          if(!locationCache.length){ await this.getCities(); }
          const match = locationCache.find(l => (l.name || '').toLowerCase() === String(body.city).toLowerCase());
          if(match) body.location_id = match.id;
          delete body.city;
        }
        const data = await request(`/vendor/stops/${id}`, { method: 'PUT', headers: authHeaders(true), body: JSON.stringify(body) });
        return { ok:true, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async deleteTransfer(id){
      try {
        await request(`/vendor/stops/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async createTransfer(payload){
      const { city, point } = payload || {};
      if(!city || !point){ return { ok:false, error: 'Thiếu thành phố hoặc điểm trung chuyển' }; }
      if(!locationCache.length){ await this.getCities(); }
      const match = locationCache.find(l => (l.name || '').toLowerCase() === String(city).toLowerCase());
      if(!match){ return { ok:false, error: 'Không tìm thấy thành phố trong danh sách' }; }
      try {
        const body = { name: point, address: point, location_id: match.id };
        const data = await request('/vendor/stops', { method: 'POST', headers: authHeaders(true), body: JSON.stringify(body) });
        return { ok: true, id: data.id, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async getVehicles(){
      try {
        const list = await request('/vendor/vehicles', { headers: authHeaders(false) });
        const items = Array.isArray(list.data) ? list.data : (Array.isArray(list) ? list : []);
        return items.map(v => ({ id: v.id, name: v.name || v.vehicle_name || 'Xe', type: v.type || v.vehicle_type || '—', seats: v.seats || v.capacity || 0 }));
      } catch(e){
        console.warn('Vehicles API fallback:', e.message);
        return [];
      }
    },

    async createVehicle(payload){
      try {
        const data = await request('/vendor/vehicles', { method: 'POST', headers: authHeaders(true), body: JSON.stringify(payload) });
        return { ok:true, id: data.id, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async getVehicle(id){
      try {
        const data = await request(`/vendor/vehicles/${id}`, { headers: authHeaders(false) });
        return data;
      } catch(e){
        return null;
      }
    },

    async updateVehicle(id, payload){
      try {
        const data = await request(`/vendor/vehicles/${id}`, { method: 'PUT', headers: authHeaders(true), body: JSON.stringify(payload) });
        return { ok:true, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async addVehicleCoaches(id, coaches){
      try {
        const data = await request(`/vendor/vehicles/${id}/coaches`, { method: 'POST', headers: authHeaders(true), body: JSON.stringify({ coaches }) });
        return { ok:true, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async removeVehicleCoach(vehicleId, coachId){
      try {
        await request(`/vendor/vehicles/${vehicleId}/coaches/${coachId}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async deleteTrip(id){
      try {
        await request(`/vendor/trips/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async hardDeleteTrip(id){
      try {
        await request(`/vendor/trips/${id}?hard=1`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async deleteTicket(id){
      try {
        await request(`/vendor/tickets/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async updateTrip(id, payload){
      try {
        const data = await request(`/vendor/trips/${id}`, { method: 'PUT', headers: authHeaders(true), body: JSON.stringify(payload) });
        return { ok:true, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async deleteVehicle(id){
      try {
        await request(`/vendor/vehicles/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async getCities(){
      try {
        const out = await request('/routes/location', { headers: authHeaders(false) });
        locationCache = Array.isArray(out.data) ? out.data : (Array.isArray(out) ? out : []);
        return locationCache.map(l => l.name);
      } catch(e){
        console.warn('Location API fallback:', e.message);
        locationCache = [];
        return [];
      }
    },

    async getVendorBookings(page=1, perPage=20){
      try {
        const resp = await request(`/vendor/bookings?per_page=${perPage}&page=${page}`, { headers: authHeaders(false) });
        const items = Array.isArray(resp.data) ? resp.data : (Array.isArray(resp) ? resp : []);
        return items.map(b => ({
          id: b.id,
          code: b.booking_code,
          customer: b.user?.name || '—',
          contact: b.user?.email || b.user?.phone_number || '—',
          route: b.trip?.route || '—',
          depAt: b.trip?.departure_datetime || null,
          vehicle: b.trip?.vehicle?.name || '—',
          plate: b.trip?.vehicle?.license_plate || '—',
          seatList: Array.isArray(b.seats) ? b.seats.map(s => s.seat_number).filter(Boolean) : [],
          seats: b.seat_count || (Array.isArray(b.seats) ? b.seats.length : 0),
          total: b.total_price || 0,
          status: b.status || '—'
        }));
      } catch(e){
        console.warn('Vendor bookings fallback:', e.message);
        return [];
      }
    },

    async updateBooking(id, payload){
      try {
        const data = await request(`/vendor/bookings/${id}`, { method: 'PUT', headers: authHeaders(true), body: JSON.stringify(payload) });
        return { ok:true, data };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async deleteBooking(id){
      try {
        await request(`/vendor/bookings/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        return { ok:true };
      } catch(e){
        return { ok:false, error: e.message };
      }
    },

    async getAllStops(){
      try {
        const groups = await request('/vendor/stops/by-location', { headers: authHeaders(false) });
        const arr = [];
        if(Array.isArray(groups)){
          groups.forEach(g => (g.stops||[]).forEach(s => arr.push(s)));
        } else if(groups && typeof groups === 'object'){
          Object.values(groups).forEach(stops => (Array.isArray(stops)?stops:[]).forEach(s => arr.push(s)));
        }
        return arr.map(s => ({ id: s.id, name: s.name || s.address || ('#'+s.id) }));
      } catch(e){
        console.warn('Stops fetch failed:', e.message);
        return [];
      }
    }
  };
})();

window.API = API;

