const textes = {
	easy: [
		"Le chat dort sur la chaise. Le chien mange son pain. Il fait chaud aujourd'hui. Ma mère prépare le repas. Mon frère et ma soeur jouent dehors. C'est une belle journée. Le matin je bois du lait. Le soir je mange du pain. La nuit je dors bien.",
	],
	medium: [
		"La maison a une grande cuisine et un beau salon. La fenêtre donne sur la forêt. Le professeur pose une question difficile. L'étudiant cherche la bonne réponse. La rivière traverse la forêt et rejoint l'océan. Les nuages annoncent la pluie.",
	],
	hard: [
		"L'implémentation de cette architecture nécessite une coordination et une documentation rigoureuse. La virtualisation et l'automatisation améliorent la performance et la scalabilité du système. L'authentification et l'autorisation sont essentielles à la sécurité de l'infrastructure.",
	],
};

let difficulty = "hard";
let currentIndex = 0;
let chars = [];
let timer = null;
let seconds = 60;
let isRunning = false;
let errors = 0;
let bestWpm = 0;

const container = document.getElementById("backgroundText");
const $btnStart = document.getElementById("btnStart");
const btnEasy = document.getElementById("easy");
const btnMedium = document.getElementById("medium");
const btnHard = document.getElementById("hard");

function getRandomTexte(diff) {
	const phrases = textes[diff];
	const index = Math.floor(Math.random() * phrases.length);
	return phrases[index];
}

function updateBestWpm() {
	const currentWpm = parseInt(document.getElementById("wpm").textContent);
	if (currentWpm > bestWpm) {
		bestWpm = currentWpm;
		document.getElementById("record").textContent = bestWpm;
	}
}

function showResults() {
	const finalWpm = document.getElementById("wpm").textContent;
	const finalAccuracy = document.getElementById("taux").textContent;
	const correct = currentIndex - errors;

	document.getElementById("finalWpm").textContent = finalWpm;
	document.getElementById("finalAccuracy").textContent = finalAccuracy + "%";
	document.getElementById("finalChars").innerHTML =
		`<span class="green">${correct}</span>/${errors}`;

	// Crée les 3 images
	const resultsSection = document.querySelector(".results");

	const star1 = document.createElement("img");
	star1.src = "assets/star1.svg";
	star1.classList.add("star1");

	const star2 = document.createElement("img");
	star2.src = "assets/star2.svg";
	star2.classList.add("star2");

	const check = document.createElement("img");
	check.src = "assets/Check.svg";
	check.classList.add("check");

	resultsSection.appendChild(star1);
	resultsSection.appendChild(star2);

	const h2 = document.querySelector(".results-content h2");
	resultsSection.querySelector(".results-content").insertBefore(check, h2);

	document.querySelector(".typing").style.display = "none";
	resultsSection.style.display = "flex";
}
function startTimer() {
	if (isRunning) return;
	isRunning = true;

	timer = setInterval(() => {
		seconds--;
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const secs = (seconds % 60).toString().padStart(2, "0");
		document.getElementById("timer").textContent = mins + ":" + secs;

		if (seconds <= 0) {
			stopTimer();
			updateBestWpm();
			showResults();
		}
	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
	isRunning = false;
}

function loadTexte() {
	container.innerHTML = "";
	currentIndex = 0;
	errors = 0;
	seconds = 60;
	document.getElementById("timer").textContent = "01:00";
	document.getElementById("wpm").textContent = "0";
	document.getElementById("taux").textContent = "0";
	stopTimer();

	const texte = getRandomTexte(difficulty);

	texte.split("").forEach((char) => {
		const span = document.createElement("span");
		span.classList.add("char");
		span.textContent = char;
		container.appendChild(span);
	});

	chars = document.querySelectorAll(".char");
	chars[0].classList.add("active");
	document.getElementById("quoteInput").value = "";
}

document.getElementById("quoteInput").addEventListener("input", (e) => {
	const typed = e.data;
	if (!typed || currentIndex >= chars.length) return;

	if (typed === chars[currentIndex].textContent) {
		chars[currentIndex].classList.add("correct");
	} else {
		chars[currentIndex].classList.add("incorrect");
		errors++;
	}

	chars[currentIndex].classList.remove("active");
	currentIndex++;

	if (currentIndex < chars.length) {
		chars[currentIndex].classList.add("active");
	}

	startTimer();

	const tempsEcoule = (60 - seconds) / 60;
	if (tempsEcoule > 0) {
		const wpm = Math.round(currentIndex / 5 / tempsEcoule);
		document.getElementById("wpm").textContent = wpm;
	}

	const accuracy = Math.round(((currentIndex - errors) / currentIndex) * 100);
	document.getElementById("taux").textContent = accuracy;

	if (currentIndex >= chars.length) {
		stopTimer();
		updateBestWpm();
		showResults();
	}
});

$btnStart.addEventListener("click", () => {
	document.querySelector(".overlay-start").style.display = "none";
	document.getElementById("quoteInput").focus();
	document.getElementById("backgroundText").classList.add("active");
	loadTexte();
});

document.getElementById("btnGoAgain").addEventListener("click", () => {
	document
		.querySelectorAll(".star1, .star2, .check")
		.forEach((el) => el.remove());

	document.querySelector(".results").style.display = "none";
	document.querySelector(".typing").style.display = "flex";
	document.querySelector(".overlay-start").style.display = "flex";
	document.getElementById("backgroundText").classList.remove("active");
	loadTexte();
});

document.getElementById("btnReStart").addEventListener("click", () => {
	document.querySelector(".overlay-start").style.display = "flex";
	document.getElementById("backgroundText").classList.remove("active");
	loadTexte();
});

function setDifficulty(newDifficulty, activeBtn) {
	difficulty = newDifficulty;
	loadTexte();

	[btnEasy, btnMedium, btnHard].forEach((btn) => {
		btn.classList.remove("color2");
		btn.classList.add("color1");
	});
	activeBtn.classList.add("color2");
	activeBtn.classList.remove("color1");
}

btnEasy.addEventListener("click", () => setDifficulty("easy", btnEasy));
btnMedium.addEventListener("click", () => setDifficulty("medium", btnMedium));
btnHard.addEventListener("click", () => setDifficulty("hard", btnHard));

loadTexte();
