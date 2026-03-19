const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
	res.locals.currentPath = req.path;
	next();
});

app.get('/', (req, res) => {
	res.render('dashboard', { title: 'Tổng quát', requireAuth: true });
});

app.get('/tickets', (req, res) => {
	res.render('tickets', { title: 'Tạo vé', requireAuth: true });
});

app.get('/transfers', (req, res) => {
	res.render('transfers', { title: 'Quản lý trung chuyển', requireAuth: true });
});

app.get('/vehicles', (req, res) => {
	res.render('vehicles', { title: 'Quản lý xe', requireAuth: true });
});

app.get('/manage-bookings', (req, res) => {
	res.render('manage-bookings', { title: 'Quản lý vé', requireAuth: true });
});

app.get('/settings', (req, res) => {
	res.render('settings', { title: 'Cài đặt', requireAuth: false });
});

app.get('/login', (req, res) => {
	res.render('login', { title: 'Đăng nhập', requireAuth: false });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((req, res) => {
	res.status(404).render('settings', { title: 'Không tìm thấy trang' });
});

app.listen(PORT, () => {
	console.log(`Vendor admin dashboard is running on http://localhost:${PORT}`);
});
