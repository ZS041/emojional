# Emojional

A full-stack Twitter-esque project I started to understand data fetching, mutation, and validation using technologies like Prisma, TRPC, and ZOD. 

## Tech Stack(T3 Stack)
React/Next.js
TRPC
Prisma
Typescript
TailwindCSS
MySQL/PlanetScale
Upstash/Redis
<ul>
<li>React/Next.js</li>
<li>TRPC</li>
<li>Prisma</li>
<li>Typescript</li>
<li>MySQL/PlanetScale</li>
<li>Upstash/Redis</li>
</ul>

## Usage

Clone the repo, run npm install in your terminal while at the project root. All dependences should be installed. 
You will need 5 environment variables, one for your database URL. I chose MySQL using Planetscale, but anything can work. 
You will need to make a Clerk account and grab the two environment variables necessary, as well as an Upstash account for the last two. 

This project is setup to be hosted on Vercel. You will need to make a .env file for local testing with these variables, as well as input them into 
your Vercel deployment when you've reached that point. The necessary variables are listed below.

<ul>
<li>DATABASE_URL</li>
<li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
<li>CLERK_SECRET_KEY</li>
<li>UPSTASH_REDIS_REST_URL</li>
<li>UPSTASH_REDIS_REST_TOKEN</li>
</ul>

Once you've installed the necessary dependencies and set up your environment variables, use npm run dev to start the project locally, then navigate to localhost:3000 to view your changes. 

You will also need to properly setup tables matching the prisma schema. This is a simple table with a few fields, id, createdAt, content, and authorId. Run prisma studio using npx prisma studio, and set up there. 



