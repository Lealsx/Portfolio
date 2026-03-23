// Adicione isso no final do body ou em um arquivo JS separado
const words = ["Desenvolvedor Web", "Criador Digital", "Problem Solver", "Tech Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedElement = document.querySelector('.typed');

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

if (typedElement) {
    typeEffect();
}
// Terminal Interativo
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const terminalHelp = document.getElementById('terminalHelp');

// Comandos disponíveis
const commands = {
    help: () => {
        terminalHelp.classList.remove('hidden');
        return;
    },
    ls: () => {
        terminalHelp.classList.add('hidden');
        document.querySelectorAll('.project-details').forEach(detail => {
            detail.classList.add('hidden');
        });
        return;
    },
    open: (args) => {
        terminalHelp.classList.add('hidden');
        const projectNum = parseInt(args);
        if (projectNum >= 1 && projectNum <= 3) {
            document.querySelectorAll('.project-details').forEach(detail => {
                detail.classList.add('hidden');
            });
            const targetProject = document.querySelector(`.project-entry[data-project="${projectNum}"] .project-details`);
            if (targetProject) {
                targetProject.classList.toggle('hidden');
            }
        } else {
            addTerminalMessage(`❌ Projeto "${args}" não encontrado. Use 'ls' para ver a lista.`);
        }
    },
    clear: () => {
        terminalOutput.innerHTML = '';
        terminalHelp.classList.add('hidden');
        addTerminalMessage('Terminal limpo.');
    }
};

function addTerminalMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'terminal-line';
    messageDiv.innerHTML = `<span class="prompt">$</span> <span style="color: ${type === 'error' ? '#ff5f56' : '#6a9955'}">${message}</span>`;
    terminalOutput.appendChild(messageDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalInput.value = '';
        
        if (input === '') return;
        
        // Mostra o comando digitado
        addTerminalMessage(input, 'command');
        
        // Processa o comando
        const [cmd, ...args] = input.split(' ');
        const arg = args.join(' ');
        
        if (commands[cmd]) {
            commands[cmd](arg);
        } else {
            addTerminalMessage(`Comando não reconhecido: ${cmd}. Digite 'help' para ajuda.`, 'error');
        }
    }
});

// Click nos projetos para abrir
document.querySelectorAll('.project-entry').forEach(project => {
    project.addEventListener('click', () => {
        const details = project.querySelector('.project-details');
        if (details) {
            details.classList.toggle('hidden');
        }
    });
});

// Mensagem inicial
setTimeout(() => {
    addTerminalMessage('Bem-vindo ao terminal de projetos! Digite "help" para começar.');
}, 500);