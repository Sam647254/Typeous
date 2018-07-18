import {generate} from "randomstring";

function showLevel(levelDisplay: HTMLElement, level: number, sublevel: number) {
	levelDisplay.innerHTML = `${level}-${sublevel}`;
}

function generateString(length: number, level: number, sublevel: number): string {
	let charset: string = level === 1 ? 'alphabetic' :
		level < 20 ? ' abcdefghijklmnopqrstuvwxyz' :
		' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let capitalization = level < 20 ? 'lowercase' : null;
	return generate({
		length,
		charset,
		capitalization
	});
}

function advance(totype: HTMLElement, length: number, level: number, sublevel: number): string {
	let str = generateString(length, level, sublevel);
	totype.innerHTML = str.replace(/ /g, '␣');
	return str;
}

function updateDisplay(typed: HTMLElement, totype: HTMLElement, str: string, index: number) {
	str = str.replace(/ /g, '␣');
	typed.innerHTML = str.substr(0, index);
	totype.innerHTML = str.substr(index, str.length - index);
}

function updateMisses(totype: HTMLElement, misses: number) {
	if (misses === 1) {
		totype.classList.add("warning1");
	} else if (misses === 2) {
		totype.classList.replace("warning1", "warning2");
	} else if (misses === 3) {
		throw "Finita";
	}
}

function startTest(levelDisplay: HTMLElement, typedDisplay: HTMLElement,
	totypeDisplay: HTMLElement) {
	let level = 1, sublevel = 1;
	let CPM = 80, characters = 10;
	let misses = 0;
	showLevel(levelDisplay, level, sublevel);
	const onEnd = () => {
		let str = advance(totypeDisplay, characters, level, sublevel);
		let index = 0;
		window.focus();
		window.onkeypress = (event: KeyboardEvent) => {
			if (event.key === str[index]) {
				++index;
				updateDisplay(typedDisplay, totypeDisplay, str, index);
			}
		};
		const cb = () => {
			CPM += 2;
			if (index < str.length) {
				++misses;
				try {
					updateMisses(totypeDisplay, misses);
				} catch (e) {
					totypeDisplay.innerHTML = e;
					typedDisplay.innerHTML = "";
					window.onkeypress = null;
					return;
				}
			}
			if (sublevel === 10) {
				++level;
				sublevel = 1;
				showLevel(levelDisplay, level, sublevel);
				typedDisplay.innerHTML = "";
				characters += 2;
				window.onkeypress = null;
				countdown(totypeDisplay, level, onEnd);
			} else {
				++sublevel;
				index = 0;
				typedDisplay.innerHTML = "";
				str = advance(totypeDisplay, characters, level, sublevel);
				showLevel(levelDisplay, level, sublevel);
				console.log(characters / CPM * 60);
				window.setTimeout(cb, characters / CPM * 60000);
			}
		}
		window.setTimeout(cb, characters / CPM * 60000);
	};
	countdown(totypeDisplay, level, onEnd);
}

function countdown(totypeDisplay: HTMLElement, level: number, onEnd: () => void) {
	let count = 3;
	totypeDisplay.innerHTML = `${count}`;
	let c = window.setInterval(() => {
		--count;
		if (count === 0) {
			window.clearInterval(c);
			onEnd();
		} else {
			totypeDisplay.innerHTML = count.toString();
		}
	}, 1000);
}

(() => {
const start = document.getElementById("start");
const levelDisplay = document.getElementById("level");
const textDisplay = document.getElementById("text");
const typedDisplay = document.getElementById("typed");
const totypeDisplay = document.getElementById("totype");
start.onclick = (event) => {
	startTest(levelDisplay, typedDisplay, totypeDisplay);
};
})();