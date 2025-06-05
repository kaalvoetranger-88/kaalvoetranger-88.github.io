// created on Wed Apr  2 13:45:02 2025  @author: kaalvoetranger@gmail.com 

console.log('Welcome to my Portfolio console');


// - 1 intersection observer ----------------------------------------------- //
// create intersection observer to animate DOM elements as they enter viewport: 
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
    });

});

// observe hidden elements: 
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// wait until the page is fully loaded before triggering fade-in
window.onload = () => {
    // Ensure the body element also fades in
    document.body.classList.add('show');
};


// - 2 navigation shapes --------------------------------------------------- //
// create wrapper for my navigation shapes
const wrapper = document.getElementById("wrapper");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const uniqueRand = (min, max, prev) => {
  let next = prev;
  
  while(prev === next) next = rand(min, max);
  
  return next;
}

const combinations = [
  { configuration: 1, roundness: 1 },
  { configuration: 1, roundness: 2 },
  { configuration: 1, roundness: 4 },
  { configuration: 2, roundness: 2 },
  { configuration: 2, roundness: 3 },
  { configuration: 3, roundness: 3 }
];

let prev = 0;

setInterval(() => {
  const index = uniqueRand(0, combinations.length - 1, prev),
        combination = combinations[index];
  
  wrapper.dataset.configuration = combination.configuration;
  wrapper.dataset.roundness = combination.roundness;
  
  prev = index;
}, 6000);

// ------------------------------------------------------------------------- //
// Get all shapes and close buttons
const shapes = document.querySelectorAll('.shape');
const closeButtons = document.querySelectorAll('.close-btn');

// Loop through each shape
shapes.forEach(shape => {
    shape.addEventListener('click', () => {
        // Get the target section based on the data-target attribute
        const targetSection = document.getElementById(shape.dataset.target);

        // Close any currently open section
        document.querySelectorAll('section').forEach(section => {
            if (!section.classList.contains('hidden')) {
                section.classList.add('hidden');
                section.style.display = 'none'; 
            }
        });

        // Open the clicked section with a sliding effect
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.style.display = 'block'; // Slide in effect
        }
    });
});

// Add event listeners to close buttons
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('section');
        section.classList.add('hidden');
        section.style.maxHeight = '0'; 
    });
});


// ------------------------------------------------------------------------- //
// Animate skills when accordion is opened

document.addEventListener("DOMContentLoaded", function () {
  const accordionInput = document.getElementById("tenth"); // Accordion radio button (for the 'Hard Skills' section)

  // Function to animate the bars when the accordion section is opened
  function animateSkillBars() {
    const bars = document.querySelectorAll("#tenth:checked ~ label + .content .skill-fill");
    bars.forEach(bar => {
      const targetWidth = bar.getAttribute("data-skill");
      bar.style.setProperty("--target-width", targetWidth); // Set CSS variable for dynamic width
      bar.classList.add("animated"); // Add the 'animated' class to start the transition
    });
  }

  // Animate if open on page load
  if (accordionInput.checked) {
    animateSkillBars();
  }

  // Animate when accordion section is opened (checked)
  accordionInput.addEventListener("change", function () {
    if (accordionInput.checked) {
      animateSkillBars();
    }
  });
});


// ------------------------------------------------------------------------- //
// Lexicon javascript
 
// Load the JSON file with the lexicon data
fetch('static/assets/lexicon.json')
  .then(response => response.json())
  .then(data => initializeLexicon(data));

// Global references to DOM elements
const alphabetNav = document.getElementById('alphabetNav');
const wordList = document.getElementById('wordList');
const wordDetails = document.getElementById('wordDetails');

// Generate the full alphabet as tabs
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let tabElements = {};  // to store references

// Function to initialize the UI
function initializeLexicon(lexicon) {
  // Sort lexicon entries alphabetically
  lexicon.sort((a, b) => a.word.localeCompare(b.word));

  // Group entries by first letter
  const grouped = {};
  alphabet.forEach(letter => grouped[letter] = []);
  lexicon.forEach(entry => {
    const firstLetter = entry.word[0].toUpperCase();
    if (grouped[firstLetter]) grouped[firstLetter].push(entry);
  });

  // Create clickable alphabet tabs
  alphabet.forEach(letter => {
    const tab = document.createElement('span');
    tab.textContent = letter;
    tab.onclick = () => scrollToLetter(letter);
    alphabetNav.appendChild(tab);
    tabElements[letter] = tab;
  });

  // Populate the word list with letter groupings
  alphabet.forEach(letter => {
    const section = document.createElement('div');
    section.className = 'letter-section';
    section.id = `section-${letter}`;

    // Letter header
    const title = document.createElement('div');
    title.className = 'letter-title';
    title.textContent = letter;
    section.appendChild(title);

    // Words under this letter
    grouped[letter].forEach(item => {
      const wordDiv = document.createElement('div');
      wordDiv.className = 'word-item';
      wordDiv.textContent = item.word;
      wordDiv.onclick = () => showDetails(item.details);
      section.appendChild(wordDiv);
    });

    wordList.appendChild(section);
  });

  // Set up scroll listener to highlight active tab
  wordList.addEventListener('scroll', highlightActiveTab);

  // Initialize first active tab
  highlightActiveTab();
}

// Scroll smoothly to a letter section
function scrollToLetter(letter) {
  const section = document.getElementById(`section-${letter}`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Display details text
function showDetails(text) {
  wordDetails.textContent = text;
}

// Highlight the tab corresponding to the topmost visible letter
function highlightActiveTab() {
  const sections = Array.from(document.getElementsByClassName('letter-section'));
  let activeLetter = alphabet[0];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const listRect = wordList.getBoundingClientRect();
    if (rect.top <= listRect.top + 10) {
      activeLetter = section.id.split('-')[1];
    } else {
      break;
    }
  }

  // Update tab classes
  alphabet.forEach(letter => {
    tabElements[letter].classList.toggle('active', letter === activeLetter);
  });
}



// ------------------------------------------------------------------------- //
// Listener to load section content

function loadSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.add("hidden");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");

    if (sectionId === "section7") {
      loadTimeline();
    }
  } else {
    console.warn(`Section with ID ${sectionId} not found`);
  }
}



// ------------------------------------------------------------------------- //
// Populate Timeline


function loadTimeline() {
  fetch("static/assets/timeline.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("timeline-container");
      const template = document.getElementById("timeline-template");

      data.forEach((item, index) => {
        const clone = template.content.cloneNode(true);
        const entry = clone.querySelector(".timeline-entry");

        entry.classList.add(index % 2 === 0 ? "right" : "left");
        entry.querySelector(".date").textContent = item.date;
        entry.querySelector("h3").textContent = item.title;
        entry.querySelector("p").textContent = item.details;
        entry.querySelector(".duration").textContent = `Duration: ${item.duration}`;

        container.appendChild(clone);
      });
    })
    .catch(err => {
      console.error("Error loading timeline:", err);
    });
}


// ------------------------------------------------------------------------- //
// Event listener for timeline

document.addEventListener("DOMContentLoaded", function () {
  const entries = document.querySelectorAll(".entry");

  const observer = new IntersectionObserver((entriesList) => {
    entriesList.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Optional: animate only once
      }
    });
  }, {
    threshold: 0.1
  });

  entries.forEach((el) => observer.observe(el));
});



// ------------------------------------------------------------------------- //
