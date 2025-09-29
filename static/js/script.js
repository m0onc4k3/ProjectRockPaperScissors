document.addEventListener('DOMContentLoaded', function() {
    const TOTAL_ROUNDS = 5;
    // Game state
    const state = {
        user: {
            score: 0,
            rounds: Array(TOTAL_ROUNDS).fill(null),
        },
        opponent: {
            score: 0,
            rounds: Array(TOTAL_ROUNDS).fill(null),
        },
        currentRound: 0,
        isGameOver: false,
        currentTurn: 'user',
        opponentState: 'waiting'
    };
    const optionsArray = ['Rock', 'Paper','Scissors'];

    // Options - User
    const userOptionsContainer = document.querySelector('.userOptions');
    // Options - opponent
    const cpuImg = document.getElementById('cpu');
    // Reset Button
    const resetBtn = document.getElementById('reset');
    // Message
    const messageEl = document.getElementById('message');

    // Functions
    function updateScoreBoard (player, state) {
        // get only the circle related to the current round
        const circle = document.getElementById(`${player}-select-${state.currentRound - 1}`);
        // we reduce one from current Round to match array index
        if (state[player].rounds[state.currentRound - 1] === 'win') { 
            circle.classList.add('won');
        } else if (state[player].rounds[state.currentRound - 1] === 'lose') {
            circle.classList.add('lost'); 
        } else if (state[player].rounds[state.currentRound - 1] === 'draw') {
            circle.classList.add('draw');
        } else {
            // when there's no currentRound result it means the game is over so we update all circles
            const circles = document.querySelectorAll('.circle');
            circles.forEach(prop => prop.className = 'circle');
        };
        // update players scores 
        document.getElementById('user-score').textContent = state.user.score;
        document.getElementById('opponent-score').textContent = state.opponent.score;
    }

    function setImage(element, imgState, type) {
        type = type.charAt(0).toUpperCase() + type.slice(1);

        // Change images from waiting to selected state
        element.src = `./static/images/size256/${imgState}${type}.png`;

        setTimeout(() => { 
            if (element.id === 'cpu') {
            element.src = `./static/images/size256/waitComputerThinking.png`; 
            } else {
                element.src = `./static/images/size256/wait${type}.png`;
            };
         }, 1000);
    }

    function getRoundResult(userChoice, cpuChoice) {
        if (userChoice === cpuChoice) return 'draw';
        return (userChoice === 'rock' && cpuChoice === 'scissors') ||
               (userChoice === 'paper' && cpuChoice === 'rock') ||
               (userChoice === 'scissors' && cpuChoice === 'paper') ? 'win' : 'lose';
    }

    let isAnimating = false;
    function selectOption(option) {
        if (isAnimating || state.isGameOver ) return;
        isAnimating = true;
        
        // Events after an user has selected an image/option
        setImage(option, 'selected', option.id);

        //Computer is thinking
        const computerSelection = optionsArray[Math.floor(Math.random() * 3)];
        setImage(cpuImg, 'selected', computerSelection);
        
        // checkScore of the current round
        const result = getRoundResult(option.id, computerSelection.toLowerCase()); //win, lose, draw
        
        // Update state
        const currentRound = state.currentRound;
        state.user.rounds[currentRound] = result; //isScored;
        state.opponent.rounds[currentRound] = result === 'win' ? 'lose' : result === 'lose' ? 'win' : 'draw';

        if (result === 'win'){
            state.user.score += 1;
        
        } else if (result === 'lose') {
            state.opponent.score += 1;

        } else if (result === 'draw') {
            state.user.score += 1;
            state.opponent.score += 1;
        };
        
        // Move to next round
        state.currentRound += 1;
        
        // Check if game is over
        checkGameOver(state);
        
        // Update UI
        updateScoreBoard('user', state);
        updateScoreBoard('opponent', state);

        // Switch turns
        state.currentTurn = 'user';
        state.opponentState = 'waiting'
        
        setTimeout(() => {isAnimating = false},1000);
    }

    function checkGameOver(state) {
        // Chek if more than TOTAL_ROUNDS rounds have been played
        const gameDone = state.currentRound >= TOTAL_ROUNDS;
        
        if (gameDone) {
            state.isGameOver = true;
            
            if (state.user.score > state.opponent.score) {
                messageEl.textContent = 'User Wins!';
            } else if (state.opponent.score > state.user.score) {
                messageEl.textContent = 'Computer Wins!';
            } else {
                messageEl.textContent = 'It\'s a Draw!';
            };
        };
    }

    function resetGame() {
        // Reset game to the initial state
        // Reset state
        state.user = {
            score: 0,
            rounds: Array(TOTAL_ROUNDS).fill(null),
        };
        state.opponent = {
            score: 0,
            rounds: Array(TOTAL_ROUNDS).fill(null),
        };
        state.currentRound= 0;
        state.isGameOver = false;
        state.currentTurn = 'user';
        state.opponentState = 'waiting'
        
        // Clear message
        messageEl.textContent = '';
        updateScoreBoard('user',state);
    }

    // Event listeners: user options
    userOptionsContainer.addEventListener('click', (e) => {
        if (
            state.currentTurn === 'user' 
            && !state.isGameOver 
            && ['rock','paper','scissors'].includes(e.target.id)
        ) {
            selectOption(e.target);
        }
    });
    
    // Event listeners: reset button
    resetBtn.addEventListener('click', resetGame);
    
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});