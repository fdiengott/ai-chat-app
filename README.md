# AI Chat App

This is a quick project I wanted to make to create my own local AI chat app!

It was a POC for myself for a number of different technologies and concepts. I decided to use Llama2 because I could download it locally onto my desktop. This way I don't need to make any API calls or worry about security. I also was able to implement some simple data fetching with Next. Even though it is through a client directive, I haven't had the opportunity much to fetch data with Next.

This project also had me finally get to implement websockets, which I've never gotten to do. I would have preferred to use Socket.io, but its integration with Bun wasn't as straightforward as I would have hoped. Speaking of, I also was glad to use Bun again for this project. It is so fast and easy to implement, that I struggle to switch to npm even if it is more tried and true (for my personal projects).

I also think Hono will be a staple for my personal projects as it is very simple to create backend APIs, something I don't do (as a frontend dev) very regularly. Alas, I hope I get to do it more often from here on out.

## Setup

After cloning the repo:

-   navigate to the backend directory and run `bun install`. If you don't have bun installed follow the installation instructions [here](https://bun.sh/).
-   navigate to the frontend directory and run `npm install`.
-   You'll also need to install llama2 which can be found [here](https://ollama.com/library/llama2).

Once everything is installed:

-   In two terminal instances navigate to the backend and frontend directories and run `bun run dev` and `npm run dev` respectively.
-   Then navigate to [http://localhost:3000](http://localhost:3000) and type in a prompt!
