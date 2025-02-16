# EthioLostAndFound

A platform to help people in Ethiopia report and find lost or found items efficiently.

## 🚀 Features

- **Report Lost Items:** Users can report lost items with details and images.
- **List Found Items:** Allows users to list found items to help reunite them with their owners.
- **Search & Filter:** Easily search and filter lost or found items.
- **User Authentication:** Secure authentication using **Better-Auth** for posting and managing listings.
- **Image Uploads:** Store and manage images using **Cloudinary**.
- **Built With:** **Next.js**, **Tailwind CSS**, **Prisma**, and **Supabase**.

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma
- **Database:** PostgreSQL (via **Supabase**)
- **Authentication:** Better-Auth
- **Image Hosting:** Cloudinary
- **Styling:** TypeScript

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/duresaguye/ethiolostandfound.git
cd ethiolostandfound
```

### 2️⃣ Install Dependencies

```sh
npm install
# or
yarn install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=Connect to Supabase via connection pooling with Supavisor.
DIRECT_URL=Your Supabase direct connection URL
NEXT_PUBLIC_SUPABASE_URL=Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Your Supabase anon key
CLOUDINARY_CLOUD_NAME=Your Cloudinary cloud name
CLOUDINARY_API_KEY=Your Cloudinary API key
CLOUDINARY_API_SECRET=Your Cloudinary API secret
BETTERAUTH_SECRET=Your BetterAuth secret
GOOGLE_CLIENT_ID=Your Google client ID
GOOGLE_CLIENT_SECRET=Your Google client secret
```

### 4️⃣ Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Deployment

To deploy the app, you can use platforms like **Vercel**, **Netlify**, or **Supabase Edge Functions**. Ensure all environment variables are properly configured.

## 📄 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository.
2. **Create** a new branch: `git checkout -b feature-branch`.
3. **Commit** your changes: `git commit -m "Add new feature"`.
4. **Push** to the branch: `git push origin feature-branch`.
5. **Submit a Pull Request** 🚀.

## 📜 License

This project is licensed under the **MIT License**.

---

