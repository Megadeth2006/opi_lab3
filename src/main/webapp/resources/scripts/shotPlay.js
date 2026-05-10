window.addEventListener("DOMContentLoaded", () => {

    const shots = [
        document.getElementById("shot1"),
        document.getElementById("shot2"),
        document.getElementById("shot3"),
        document.getElementById("shot4")
    ];

    let savedShotCount = 1;
    window.shotsEnabled = false;

    function playRandomShot() {
        const sound = shots[Math.floor(Math.random() * shots.length)];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    const svg = document.getElementById("mainSvg");
    if (svg) {
        svg.addEventListener("click", () => {
            if (checkR()) {
                playRandomShot();

                resetXBoxes();
                document.getElementById("hiddenX").value = "";
                window.resetXServerGlobal();

                resetYInput();
                window.resetYServerGlobal();
            }
        });
    }
    function resetYInput() {
        const yInput = document.getElementById("yInput");
        const hiddenY = document.getElementById("hiddenY");

        if (yInput) yInput.value = "";
        if (hiddenY) hiddenY.value = "";
    }


    window.saveShotCount = function () {
        const hiddenX = document.getElementById("hiddenX").value;

        if (!hiddenX || hiddenX.trim() === "") {
            savedShotCount = 0;
            return;
        }

        const arr = hiddenX.split(",").filter(v => v.trim() !== "");
        savedShotCount = arr.length > 0 ? arr.length : 0;
    };


    window.playShotsInstant = function () {
        for (let i = 0; i < savedShotCount; i++) {
            setTimeout(() => {
                playRandomShot();
            }, i * 50);
        }


        setTimeout(() => {
            clearHiddenInputs();
        }, savedShotCount * 60);
    };


});
function clearHiddenInputs() {
    const hiddenY = document.getElementById("hiddenY");
    const hiddenR = document.getElementById("hiddenR");
    const hiddenX = document.getElementById("hiddenX");

    if (hiddenY) hiddenY.value = "";
    if (hiddenR) hiddenR.value = "";
    if (hiddenX) hiddenX.value = "";

    const yInput = document.getElementById("yInput");
    if (yInput) yInput.value = "";
}

function resetXBoxes() {
    const boxes = document.querySelectorAll('input[type="checkbox"][data-x]');
    boxes.forEach(cb => cb.checked = false);
    document.getElementById("hiddenX").value = "";
}