# Hotel Admin Panel

A hotel management admin panel built with **React** and **Vite**. It lets hotel staff track rooms, bookings and customers from a single dashboard.

Built solo as a university web development project.

## Features

- **Login with protected routes**: admin pages are only available after signing in
- **Dashboard**: total bookings, rooms and customers, today's check-ins and check-outs, occupancy rate and revenue
- **Rooms**: add, edit and delete rooms
- **Bookings**: create and manage reservations and their statuses (confirmed, checked-in, completed)
- **Customers**: manage the customer list

## Tech stack

- React 19
- React Router 7
- Vite
- localStorage for data persistence (no backend)

## Run locally

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Demo login

This is a demo project with a built-in admin account:

- Username: `admin`
- Password: `admin123`

## Notes

All data is stored in the browser's localStorage, so it stays on your device and resets if you clear browser data.
