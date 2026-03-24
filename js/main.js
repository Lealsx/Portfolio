// ========== TERMINAL COM BOTÕES DE FECHAR ==========

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do terminal
    const terminalInput = document.getElementById('terminalInput');
    const terminalMessages = document.getElementById('terminalOutput');
    const terminalHelp = document.getElementById('terminalHelp');
    const terminalProjects = document.getElementById('terminalProjects');
    
    // Verifica se os elementos existem
    if (!terminalInput) console.error(' Elemento terminalInput não encontrado');
    if (!terminalMessages) console.error(' Elemento terminalOutput não encontrado');
    if (!terminalProjects) console.error(' Elemento terminalProjects não encontrado');
    
    // Lista de projetos
    const projectsList = [
        { id: 1, name: "landing-moderna", desc: "Landing page responsiva com animações", tech: "HTML5, CSS3, JavaScript, GSAP" },
        { id: 2, name: "task-app", desc: "App de tarefas com localStorage", tech: "React, Hooks, CSS Modules" },
        { id: 3, name: "dashboard-analytics", desc: "Dashboard interativo com gráficos", tech: "Next.js, Chart.js, Tailwind" },
        { id: 4, name: "ecommerce-clone", desc: "Clone de e-commerce com carrinho", tech: "Next.js, Stripe, Tailwind" }
    ];
    
    // Estado
    let projectsRevealed = false;
    let openProjects = new Set();
    
    // Função para adicionar mensagem no terminal
    function addTerminalMessage(message, type = 'information') {
        if (!terminalMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'terminal-line';
        
        let color = '#6a9955';
        let prefix = '>';
        
        switch(type) {
            case 'error':
                color = '#ff5f56';
                prefix = '';
                break;
            case 'success':
                color = '#00ff41';
                prefix = '';
                break;
            case 'information':
                color = '#0077ff';
                prefix = '!';
                break;
            case 'command':
                color = '#ffffff';
                prefix = '$';
                break;
            case 'warning':
                color = '#ffbd2e';
                prefix = '';
                break;
            case 'txt':
                color = '#6a9955';
                prefix = '';
                break;
            default:
                color = '#6a9955';
                prefix = '$';
        }
        
        if (type === 'command') {
            messageDiv.innerHTML = `<span class="prompt" style="color: #00ff41;">$</span> <span style="color: ${color}">${message}</span>`;
        } else {
            messageDiv.innerHTML = `<span style="color: ${color}">${prefix} ${message}</span>`;
        }
        
        terminalMessages.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Função para revelar os projetos
    function revealProjects() {
        if (!projectsRevealed) {
            projectsRevealed = true;
            terminalProjects.classList.remove('hidden');
            terminalProjects.classList.add('visible');
            setTimeout(() => {
                addTerminalMessage(' Diretório carregado com sucesso!', 'success');
                addTerminalMessage(' Clique no botão ✕ para fechar um projeto', 'information');
                addTerminalMessage(' Use "open [ID]" para abrir projetos (pode abrir vários!)', 'information');
            }, 300);
        }
    }
    
    // Função para abrir projeto
    function openProject(projectId) {
        if (!projectsRevealed) {
            addTerminalMessage(` Primeiro, digite "ls" para listar os projetos disponíveis!`, 'warning');
            return false;
        }
        
        const id = parseInt(projectId);
        
        if (isNaN(id)) {
            addTerminalMessage(`ID inválido: "${projectId}". Use números (ex: open 1)`, 'error');
            return false;
        }
        
        const projectData = projectsList.find(p => p.id === id);
        
        if (!projectData) {
            addTerminalMessage(`Projeto com ID ${id} não encontrado. Use "ls" para ver a lista.`, 'error');
            return false;
        }
        
        if (openProjects.has(id)) {
            addTerminalMessage(`Projeto "${projectData.name}" já está aberto.`, 'information');
            return false;
        }
        
        openProjects.add(id);
        
        const projectElement = document.querySelector(`.project-entry[data-project="${id}"]`);
        
        if (projectElement) {
            const details = projectElement.querySelector('.project-details');
            if (details) {
                details.classList.remove('hidden');
            }
            
            // Mostra o botão de fechar mais visível quando aberto
            const closeBtn = projectElement.querySelector('.project-close-btn');
            if (closeBtn) {
                closeBtn.style.opacity = '1';
            }
            
            addTerminalMessage(` Projeto "${projectData.name}" aberto!`, 'success');
            
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            return true;
        } else {
            addTerminalMessage(` Elemento do projeto não encontrado.`, 'error');
            return false;
        }
    }
    
    // Função para fechar projeto (usada pelo botão e comando)
    function closeProjectById(projectId, source = 'button') {
        const id = parseInt(projectId);
        
        if (isNaN(id)) {
            if (source === 'command') {
                addTerminalMessage(` Uso: close [ID] (ex: close 1)`, 'error');
            }
            return false;
        }
        
        if (!openProjects.has(id)) {
            if (source === 'command') {
                addTerminalMessage(` Projeto ${id} não está aberto.`, 'information');
            }
            return false;
        }
        
        const projectData = projectsList.find(p => p.id === id);
        const projectElement = document.querySelector(`.project-entry[data-project="${id}"]`);
        
        if (projectElement) {
            const details = projectElement.querySelector('.project-details');
            if (details) {
                details.classList.add('hidden');
            }
            
            // Adiciona animação de fechar
            projectElement.classList.add('closing');
            setTimeout(() => {
                projectElement.classList.remove('closing');
            }, 300);
            
            openProjects.delete(id);
            
            // Esconde o botão se não tiver mais projetos abertos
            const closeBtn = projectElement.querySelector('.project-close-btn');
            if (closeBtn && openProjects.size === 0) {
                closeBtn.style.opacity = '0.6';
            }
            
            if (source === 'command') {
                addTerminalMessage(` Projeto "${projectData?.name || id}" fechado.`, 'success');
            }
            
            return true;
        }
        
        return false;
    }
    
    // Função para fechar todos os projetos
    function closeAllProjects() {
        if (openProjects.size === 0) {
            addTerminalMessage(` Nenhum projeto aberto.`, 'information');
            return;
        }
        
        const projectsToClose = [...openProjects];
        projectsToClose.forEach(id => {
            const projectElement = document.querySelector(`.project-entry[data-project="${id}"]`);
            if (projectElement) {
                const details = projectElement.querySelector('.project-details');
                if (details) {
                    details.classList.add('hidden');
                }
                const closeBtn = projectElement.querySelector('.project-close-btn');
                if (closeBtn) {
                    closeBtn.style.opacity = '0.6';
                }
            }
        });
        
        openProjects.clear();
        addTerminalMessage(`Todos os ${projectsToClose.length} projetos foram fechados.`, 'success');
    }
    
    // Função para listar projetos
    function listProjects() {
        if (!projectsRevealed) {
            revealProjects();
        }
    }
    
    // Função para limpar terminal
    function clearTerminal() {
        if (terminalMessages) {
            terminalMessages.innerHTML = '';
            addTerminalMessage(' Terminal limpo.', 'success');
            addTerminalMessage(' Digite "help" para ver os comandos.', 'info');
            
            if (!projectsRevealed) {
                addTerminalMessage(' Digite "ls" para listar os projetos.', 'info');
            } else {
                addTerminalMessage(' Digite "ls" para listar os projetos novamente.', 'information');
                addTerminalMessage(` Projetos abertos: ${openProjects.size}`, 'information');
            }
        }
        
        if (terminalHelp) {
            terminalHelp.classList.add('hidden');
        }
    }
    
    // Função para mostrar status
    function showStatus() {
        if (!projectsRevealed) {
            addTerminalMessage(`Projetos ainda não carregados. Digite "ls" para listar.`, 'information');
        } else {
            addTerminalMessage(`Projetos abertos: ${openProjects.size}`, 'success');
            if (openProjects.size > 0) {
                const openList = Array.from(openProjects).map(id => {
                    const proj = projectsList.find(p => p.id === id);
                    return `${id}: ${proj?.name}`;
                }).join(', ');
                addTerminalMessage(`   IDs abertos: ${openList}`, 'information');
            }
        }
    }
    
    // Função para mostrar ajuda
    function showHelp() {
        addTerminalMessage('   TERMINAL DE PROJETOS - AJUDA            ', 'success');
        addTerminalMessage('  COMANDOS DISPONÍVEIS:                        ', 'command');
        addTerminalMessage('  help     - Mostra esta mensagem              ', 'command');
        addTerminalMessage('  ls       - Lista todos os projetos           ', 'command');
        addTerminalMessage('  open [n] - Abre detalhes do projeto          ', 'command');
        addTerminalMessage('  close [n]- Fecha projeto específico          ', 'command');
        addTerminalMessage('  closeall - Fecha todos os projetos           ', 'command');
        addTerminalMessage('  clear    - Limpa o terminal                  ', 'command');
        addTerminalMessage('  status   - Mostra status atual               ', 'command');
        addTerminalMessage('      TAMBÉM PODE:                             ', );
        addTerminalMessage('  Clique no botão ✕ ao lado do projeto        ', 'command');
        
        if (terminalHelp) {
            terminalHelp.classList.remove('hidden');
        }
    }
    
    // Processa comandos
    function processCommand(input) {
        const parts = input.toLowerCase().trim().split(' ');
        const cmd = parts[0];
        const arg = parts[1];
        
        switch(cmd) {
            case 'help':
                showHelp();
                return true;
            case 'ls':
                listProjects();
                return true;
            case 'open':
                if (arg) {
                    openProject(arg);
                } else {
                    addTerminalMessage(' Uso: open [ID] (ex: open 1)', 'error');
                }
                return true;
            case 'close':
                if (arg) {
                    closeProjectById(arg, 'command');
                } else {
                    addTerminalMessage(' Uso: close [ID] (ex: close 1)', 'error');
                    addTerminalMessage(' Use "closeall" para fechar todos os projetos.', 'information');
                }
                return true;
            case 'closeall':
                closeAllProjects();
                return true;
            case 'clear':
                clearTerminal();
                return true;
            case 'status':
                showStatus();
                return true;
            default:
                addTerminalMessage(`Comando não reconhecido: "${input}". Digite "help" para ajuda.`, 'error');
                return false;
        }
    }
    
    // Evento do input do terminal
    if (terminalInput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value.trim();
                terminalInput.value = '';
                
                if (input === '') return;
                
                addTerminalMessage(input, 'command');
                processCommand(input);
            }
        });
    }
    
    // ========== EVENTOS DOS BOTÕES DE FECHAR ==========
    function setupCloseButtons() {
        const closeButtons = document.querySelectorAll('.project-close-btn');
        closeButtons.forEach(btn => {
            // Remove evento anterior para evitar duplicação
            btn.removeEventListener('click', handleCloseClick);
            btn.addEventListener('click', handleCloseClick);
        });
    }
    
    function handleCloseClick(e) {
        e.stopPropagation(); // Evita que o clique no botão também abra o projeto
        const projectId = this.getAttribute('data-project');
        if (projectId) {
            const projectData = projectsList.find(p => p.id === parseInt(projectId));
            
            // Adiciona mensagem no terminal
            addTerminalMessage(`Fechando projeto ${projectData?.name || projectId}...`, 'command');
            // Fecha o projeto
            closeProjectById(projectId, 'button');
            // Mostra confirmação no terminal
            addTerminalMessage(` Projeto fechado via botão!`, 'success');
        }
    }
    
    // Click nos projetos para abrir (exceto no botão)
    const projectEntries = document.querySelectorAll('.project-entry');
    projectEntries.forEach(project => {
        project.addEventListener('click', function(e) {
            // Se clicou no botão de fechar, não faz nada (já tratado)
            if (e.target.classList.contains('project-close-btn')) return;
            
            if (!projectsRevealed) {
                addTerminalMessage(` Primeiro, digite "ls" para listar os projetos!`, 'warning');
                return;
            }
            
            const projectId = this.getAttribute('data-project');
            if (projectId) {
                if (!openProjects.has(parseInt(projectId))) {
                    addTerminalMessage(`open ${projectId}`, 'command');
                    openProject(projectId);
                } else {
                    addTerminalMessage(`Projeto ${projectId} já está aberto.`, 'information');
                }
            }
        });
    });
    
    // Inicializa os botões de fechar
    setupCloseButtons();
    
    // Observador para quando novos projetos forem adicionados (caso necessário)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setupCloseButtons();
            }
        });
    });
    
    observer.observe(document.getElementById('projectsContainer'), { childList: true, subtree: true });
    
    // ========== MENSAGEM INICIAL ==========
    setTimeout(() => {
        
        addTerminalMessage(' Bem-vindo ao terminal interativo de projetos!,ele ainda está em desenvolvimento. ', 'command');
        //addTerminalMessage('   Bem-vindo ao terminal interativo!, Os projetos estão ocultos... ', 'command');
     //   addTerminalMessage('   Digite "ls" para revelá-los! ','txt');
       // addTerminalMessage('   Clique no botão ✕ para fechar projetos ', 'txt');
       // addTerminalMessage('   Digite "help" para ver os comandos ', 'txt');
    }, 300);
    
    // Garante que os projetos comecem ocultos
    terminalProjects.classList.add('hidden');
});