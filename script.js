console.log("Let's start with JavaScript");

let currentSong = new Audio();

let songs;
let currFolder;

function formatSeconds(totalSeconds) {
    // Handle invalid or negative inputs
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const minutesPadded = String(minutes).padStart(2, '0');
    const secondsPadded = String(seconds).padStart(2, '0');

    return `${minutesPadded}:${secondsPadded}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Artist Name</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
            </li>`;
    }

    Array.from(document.querySelectorAll(".song-list li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").textContent.trim());
        });
    });
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").textContent = decodeURI(track);
    document.querySelector(".songtime").textContent = "00:00 / 00:00";
}





async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:5501/songs/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    
     let anchors = div.getElementsByTagName("a")
     let cardContainer = document.querySelector(".cardContainer")
         
      let array = Array.from(anchors)
    
            for (let index = 0; index < array.length; index++) {
                let e = array[index];
                
            

       if(e.href.includes("/songs/")) {
        let folder = e.href.split("/").slice(-1)[0]


        

        // get the metadata of the folder 
        let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
        let response = await a.json();
        

        cardContainer.innerHTML = cardContainer.innerHTML + `
        <div data-folder="${folder}" class="card">
                        <div    class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#7ed321" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg"
                            alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
        `
       }
    }
     
     Array.from(document.getElementsByClassName(`card`)).forEach(e=>{
            
        e.addEventListener("click", async item=>{
            songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
}












async function main() {
    await getSongs("songs/cs");
    playMusic(songs[0], true);

   // Display ALBUMS 
   displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").textContent = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").addEventListener("change", e => {
        currentSong.volume = e.target.value / 100;
    });

    // add event listene rto mute the track 
    document.querySelector(".volume>img").addEventListener("click" , e=>{
        console.log(e.target)

        if(e.target.src.includes("volumeon.svg")){
            e.target.src= e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src= e.target.src.replace ("mute.svg","volumeon.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })


        

}

main();
