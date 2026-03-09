const texte =
	"The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. We've underestimated ancient peoples' navigational capabilities and their appetite for luxury goods, the lead researcher observed. Globalization isn't as modern as we assume.";
const container = document.getElementById("backgroundText");
const $btnStart = document.getElementById("btnStart");
const wordsPerMin = document.querySelector("#wpm");
const taux = document.querySelector("#taux");
const time = document.querySelector("#timer");

let timer = null;
let seconds = 0;
let isRunning = false;

function startTimer() {
	if (isRunning) return;
	isRunning = true;

	timer = setInterval(() => {
		seconds++;

		const secs = (seconds % 60).toString().padStart(2, "0");
		time.textContent = secs;

		if (seconds >= 60) {
			stopTimer();
			alert("Plus de temps !");
		}
	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
	isRunning = false;
}

texte.split("").forEach((char) => {
	const span = document.createElement("span");
	span.classList.add("char");
	span.textContent = char;
	container.appendChild(span);
});

let currentIndex = 0;
const chars = document.querySelectorAll(".char");

chars[0].classList.add("active");

document.getElementById("quoteInput").addEventListener("input", (e) => {
	const typed = e.data;
	if (!typed || currentIndex >= chars.length) return;

	if (typed === chars[currentIndex].textContent) {
		chars[currentIndex].classList.add("correct");
	} else {
		chars[currentIndex].classList.add("incorrect");
	}

	chars[currentIndex].classList.remove("active");
	currentIndex++;
	if (currentIndex < chars.length) {
		chars[currentIndex].classList.add("active");
	}
	startTimer();

	if (currentIndex >= 60) {
		stopTimer();
	}
});

$btnStart.addEventListener("click", () => {
	document.querySelector(".overlay-start").style.display = "none";
	document.getElementById("quoteInput").focus();
	document.getElementById("backgroundText").classList.add("active");
});
