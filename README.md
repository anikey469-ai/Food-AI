# FoodLink AI

A responsive React dashboard and MongoDB-backed Express API for a food-surplus prediction and donation-matching project. The browser includes synthetic demo data and runs without credentials; account login and stored records use MongoDB when the API is configured.

## Start the demo UI

```powershell
cd foodlink-ai
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Select **Explore sample workspace** to use the interface without an API or MongoDB connection. The sample figures and simulated prediction are illustrative, not live or trained-model outputs. The live map uses free OpenStreetMap tiles and requires an internet connection; the sample partner points are approximate locations around Mumbai.

## Configure MongoDB login and storage

1. Create a MongoDB database (MongoDB Atlas free tier is sufficient) and allow your development IP in its network access settings.
2. In `foodlink-ai/.env`, replace the `MONGODB_URI` placeholder with your Atlas connection string. URL-encode special characters in the database username/password.
3. Replace `JWT_SECRET` with a long random secret. Keep `.env` private; it is excluded by `.gitignore`.
4. In a second terminal run `npm --prefix server install`, then `npm --prefix server run dev`.
5. The API is available at `http://localhost:5000/api`. Register an account using the sign-in form's **Create account** link, then sign in.

The API provides bcrypt-hashed account registration/login, JWT-protected CRUD endpoints for restaurant, NGO and donation records, and `/api/health`. Login records and app data are isolated by account. The UI falls back to the demo workspace when the API is unavailable.

## API routes

- `POST /api/auth/register` — `{ "name", "email", "password" }` (minimum 8 characters)
- `POST /api/auth/login` — `{ "email", "password" }`
- `GET /api/records/:kind` — authenticated list (`restaurant`, `ngo`, or `donation`)
- `POST /api/records/:kind` — authenticated create; JSON body is the record
- `PATCH /api/records/:kind/:id` — authenticated update
- `DELETE /api/records/:kind/:id` — authenticated delete

Send API tokens in `Authorization: Bearer <token>`. Set `VITE_API_URL` in the root `.env` only if the API URL differs from `http://localhost:5000/api`.

## Project notes

The synthetic demonstration includes 12 restaurants, 8 NGOs and 30 donation history rows. Safe-consumption windows and dietary restrictions are treated as matching constraints, with final food-safety verification left to authorized staff. The matching score and forecast are explainable prototype simulations.
