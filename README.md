# Emojional

A full-stack Twitter-esque project built with the intention of gaining a better understanding of type safety, data fetching, mutation, and validation using technologies like Prisma, TRPC, and ZOD. 

## Tech Stack(T3 Stack)
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

You will also need to setup tables and data fields. This is a simple posts table with a few fields, id, createdAt, content, and authorId. Prisma provides a suite of tools that make this process extremely easy with an extremely well-documented process that can be found here, [Prisma](https://www.prisma.io/docs).



