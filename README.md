# Dove-Client

### :pushpin: About project
<p align="justify">This project was created as a copy of the well-known telegram, in it I tried to make the minimum functionality from the same telegram, for communication, searching and adding to contacts. Data is loaded through the Apollo library using graphs, unfortunately it did not work out to make web sockets, since this library is poorly described for web sockets on the Apollo server, I tried to implement it through the TypeGraphql library, but unfortunately I can’t find more detailed information to configure it under chat rooms. As a result, the project is built on ordinary requests and which for messages make a call every 200 milliseconds. In this project, I did the upload of the photo through axios, since Apollo did not work for me with the graphql-upload library. The rest of the functionality works fine. All pages are built on styled components, and typescript, with data typing.

The pages are also adapted to resizing the screen, and there is a switch from the keyboard</p>

---

### :minidisc: Site

<a href="https://dove-client.vercel.app/">Project site</a>

---

### :book: Libraries

- @apollo/client
- axios
- graphql
- react
- react-dom
- react-redux
- reduxtoolkit
- react-router-dom
- redux-persist
- styled-components
- webpack

---

### :pizza: Commands

- npm run dev: <strong>run in development mode</strong>
- npm run build: <strong>assemble the project</strong>
- npm run start: <strong>run the built project</strong>


---

<div id="badges" align="center">  
<a href="https://www.linkedin.com/in/sinedviper"> 
<img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/> 
</a> 
<a href="https://www.instagram.com/sinedviper"> 
<img src="https://img.shields.io/badge/Instagram-orange?style=for-the-badge&logo=instagram&logoColor=white" alt="Twitter Badge"/> 
</a>
<a href="https://www.t.me/sinedviper"> 
<img src="https://img.shields.io/badge/Telegram-purple?style=for-the-badge&logo=telegram&logoColor=white" alt="Twitter Badge"/> 
</a>
 </div>
