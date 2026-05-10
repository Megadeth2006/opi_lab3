window.onload = function () {
    const audio = document.getElementById("audioBG");
    const button = document.getElementById("musicButton");
    let isPlaying = false;
    button.addEventListener('click', function (){
        if (!isPlaying) {
            audio.play();
            button.textContent = "Выключить звук";

        } else {
            audio.pause();
            button.textContent = "Включить звук";

        }
        isPlaying = !isPlaying;
    })
}