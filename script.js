// Organização em escopo para boas práticas
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // ACCORDION (SEÇÕES EXPANSÍVEIS)
    // ==========================================================================
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector(".accordion-icon");
            const estaAberto = content.classList.contains("aberto");
            
            // Fechar todos os itens primeiro (opcional para estilo sanfona puro)
            document.querySelectorAll(".accordion-content").forEach(c => c.classList.remove("aberto"));
            document.querySelectorAll(".accordion-icon").forEach(i => i.textContent = "+");
            document.querySelectorAll(".accordion-header").forEach(h => h.setAttribute("aria-expanded", "false"));
            
            if (!estaAberto) {
                content.classList.add("aberto");
                icon.textContent = "−";
                header.setAttribute("aria-expanded", "true");
            }
        });
    });

    // ==========================================================================
    // CONTROLE DE ACESSIBILIDADE
    // ==========================================================================
    const toggleAcessibilidade = document.getElementById("toggle-acessibilidade");
    const painelAcessibilidade = document.getElementById("painel-acessibilidade");
    
    toggleAcessibilidade.addEventListener("click", () => {
        const ativo = painelAcessibilidade.classList.toggle("ativo");
        toggleAcessibilidade.setAttribute("aria-expanded", ativo);
    });

    // Modificação de Tamanho da Fonte
    let tamanhoAtual = 100; // Percentual
    const btnAumentar = document.getElementById("btn-aumentar-fonte");
    const btnDiminuir = document.getElementById("btn-diminuir-fonte");
    
    btnAumentar.addEventListener("click", () => {
        if (tamanhoAtual < 130) {
            tamanhoAtual += 10;
            document.documentElement.style.fontSize = `${tamanhoAtual}%`;
        }
    });
    
    btnDiminuir.addEventListener("click", () => {
        if (tamanhoAtual > 80) {
            tamanhoAtual -= 10;
            document.documentElement.style.fontSize = `${tamanhoAtual}%`;
        }
    });

    // Alternar Modo Claro / Escuro
    const btnModoEscuro = document.getElementById("btn-modo-escuro");
    btnModoEscuro.addEventListener("click", () => {
        document.body.classList.toggle("modo-claro");
    });

    // ==========================================================================
    // ACESSIBILIDADE: LEITURA POR VOZ (SpeechSynthesis API)
    // ==========================================================================
    const btnOuvir = document.getElementById("btn-ouvir");
    const btnPararOuvir = document.getElementById("btn-parar-ouvir");
    let topicoVoz = null;

    btnOuvir.addEventListener("click", () => {
        // Interrompe qualquer leitura prévia ativa
        window.speechSynthesis.cancel();

        // Seleciona exclusivamente o conteúdo principal conforme requisitos
        const conteudoPrincipal = document.getElementById("conteudo-principal");
        
        // Clona o conteúdo para remover botões, formulários e elementos interativos da leitura
        const clone = conteudoPrincipal.cloneNode(true);
        const elementosIgnorados = clone.querySelectorAll("button, form, textarea, .caixa-comentario, .accordion-header");
        elementosIgnorados.forEach(el => el.remove());

        const textoParaLer = clone.innerText.trim();

        if (textoParaLer) {
            topicoVoz = new SpeechSynthesisUtterance(textoParaLer);
            topicoVoz.lang = "pt-BR";
            
            topicoVoz.onstart = () => {
                btnOuvir.textContent = "🔊 Lendo...";
                btnPararOuvir.disabled = false;
            };
            
            topicoVoz.onend = () => {
                resetarBotoesVoz();
            };

            topicoVoz.onerror = () => {
                resetarBotoesVoz();
            };

            window.speechSynthesis.speak(topicoVoz);
        }
    });

    btnPararOuvir.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        resetarBotoesVoz();
    });

    function resetarBotoesVoz() {
        btnOuvir.textContent = "🔊 Ouvir Texto";
        btnPararOuvir.disabled = true;
    }

    // ==========================================================================
    // INTERAÇÃO: FORMULÁRIO DE INSCRIÇÃO SEMINÁRIO
    // ==========================================================================
    const formSeminario = document.getElementById("form-seminario");
    const msgSucesso = document.getElementById("mensagem-sucesso");

    formSeminario.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simulação de envio seguro de dados
        msgSucesso.removeAttribute("hidden");
        formSeminario.reset();
        
        setTimeout(() => {
            msgSucesso.setAttribute("hidden", "true");
        }, 5000);
    });

    // ==========================================================================
    // INTERAÇÃO: ÁREA DE COMENTÁRIOS
    // ==========================================================================
    const formComentario = document.getElementById("form-comentario");
    const txtComentario = document.getElementById("txt-comentario");
    const listaComentarios = document.getElementById("lista-comentarios");

    formComentario.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const texto = txtComentario.value.trim();
        if (texto) {
            const item = document.createElement("div");
            item.className = "comentario-item";
            
            const meta = document.createElement("div");
            meta.className = "comentario-meta";
            meta.textContent = `Enviado por Leitor Anônimo • Agora mesmo`;
            
            const corpo = document.createElement("p");
            corpo.textContent = texto;
            
            item.appendChild(meta);
            item.appendChild(corpo);
            listaComentarios.prepend(item);
            
            txtComentario.value = "";
        }
    });
});