/**
 * Função principal que inicializa a aplicação
 * Adiciona event listeners e configura validações
 */
function inicializarApp() {
    // Obtém referências dos elementos do DOM
    const formulario = document.getElementById("formularioIdade")
    const inputNome = document.getElementById("nomeCompleto")
    const inputData = document.getElementById("dataNascimento")
    const resultado = document.getElementById("resultado")
    const erroNome = document.getElementById("erroNome")
    const erroData = document.getElementById("erroData")
  
    // Define a data máxima como hoje para evitar datas futuras
    const hoje = new Date().toISOString().split("T")[0]
    inputData.setAttribute("max", hoje)
  
    // Adiciona event listener para o submit do formulário
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault()
  
      // Obtém os valores dos campos
      const nomeCompleto = inputNome.value.trim()
      const dataNascimento = inputData.value
  
      // Valida os dados inseridos
      if (validarDados(nomeCompleto, dataNascimento)) {
        // Se válidos, verifica a idade e exibe o resultado
        verificarIdade(nomeCompleto, dataNascimento)
      }
    })
  
    /**
     * Função para validar os dados inseridos pelo usuário
     */
    function validarDados(nome, data) {
      let valido = true
  
      // Limpa mensagens de erro anteriores
      ocultarErros()
  
      // Validação do nome
      if (!nome || nome.length < 2) {
        mostrarErro(erroNome, "Por favor, digite um nome válido com pelo menos 2 caracteres.")
        valido = false
      }
  
      // Validação da data
      if (!data) {
        mostrarErro(erroData, "Por favor, selecione uma data de nascimento.")
        valido = false
      } else {
        const dataNasc = new Date(data)
        const dataAtual = new Date()
  
        if (dataNasc > dataAtual) {
          mostrarErro(erroData, "A data de nascimento não pode ser no futuro.")
          valido = false
        }
  
        const anoAtual = dataAtual.getFullYear()
        const anoNascimento = dataNasc.getFullYear()
        if (anoAtual - anoNascimento > 150) {
          mostrarErro(erroData, "Por favor, verifique a data de nascimento.")
          valido = false
        }
      }
  
      return valido
    }
  
    /**
     * Função para calcular a idade em uma data específica
     */
    function calcularIdadeNaData(dataNascimento, dataReferencia) {
      let idade = dataReferencia.getFullYear() - dataNascimento.getFullYear()
      const mesReferencia = dataReferencia.getMonth()
      const diaReferencia = dataReferencia.getDate()
      const mesNascimento = dataNascimento.getMonth()
      const diaNascimento = dataNascimento.getDate()
  
      if (mesReferencia < mesNascimento || (mesReferencia === mesNascimento && diaReferencia < diaNascimento)) {
        idade--
      }
  
      return idade
    }
  
    /**
     * Função para determinar a situação eleitoral
     */
    function determinarSituacaoEleitoral(idadeEm2026) {
      if (idadeEm2026 < 16) {
        return {
          tipo: "nao-pode-votar",
          mensagem: "Você ainda não tem idade para Votar na Próxima Eleição",
        }
      } else if ((idadeEm2026 >= 16 && idadeEm2026 < 18) || idadeEm2026 >= 70) {
        return {
          tipo: "voto-facultativo",
          mensagem: "Seu Voto é Facultativo na Próxima Eleição",
        }
      } else if (idadeEm2026 >= 18 && idadeEm2026 <= 69) {
        return {
          tipo: "voto-obrigatorio",
          mensagem: "Seu Voto é Obrigatório na Próxima Eleição",
        }
      }
    }
  
    /**
     * Função para verificar idade e situação eleitoral
     */
    function verificarIdade(nome, data) {
      const dataNascimento = new Date(data)
      const dataAtual = new Date()
  
      // Calcula a idade atual
      const idadeAtual = calcularIdadeNaData(dataNascimento, dataAtual)
      const ehMaiorDeIdade = idadeAtual >= 18
  
      // Calcula a idade em outubro de 2026
      const dataEleicao2026 = new Date(2026, 9, 1)
      const idadeEm2026 = calcularIdadeNaData(dataNascimento, dataEleicao2026)
  
      // Determina a situação eleitoral
      const situacaoEleitoral = determinarSituacaoEleitoral(idadeEm2026)
  
      // Exibe o resultado
      exibirResultado(nome, idadeAtual, ehMaiorDeIdade, idadeEm2026, situacaoEleitoral)
    }
  
    /**
     * Função para exibir o resultado - SEM emoji problemático
     */
    function exibirResultado(nome, idadeAtual, maiorDeIdade, idadeEm2026, situacaoEleitoral) {
      // Limpa classes anteriores
      resultado.className = "resultado"
  
      // Define a mensagem principal
      let mensagemPrincipal
      if (maiorDeIdade) {
        mensagemPrincipal = `Olá, <strong>${nome}</strong>!<br>Você tem ${idadeAtual} anos e é <strong>maior de idade</strong>.`
        resultado.classList.add("maior")
      } else {
        mensagemPrincipal = `Olá, <strong>${nome}</strong>!<br>Você tem ${idadeAtual} anos e é <strong>menor de idade</strong>.`
        resultado.classList.add("menor")
      }
  
      // Cria a mensagem eleitoral SEM emoji
      const mensagemEleitoral = `
        <div class="info-eleitoral ${situacaoEleitoral.tipo}">
          <strong>Situação Eleitoral para 2026</strong><br>
          Em outubro de 2026 você terá ${idadeEm2026} anos.<br>
          <strong>${situacaoEleitoral.mensagem}</strong>
        </div>
      `
  
      // Combina as mensagens
      const mensagemCompleta = mensagemPrincipal + mensagemEleitoral
  
      // Exibe o resultado
      resultado.innerHTML = mensagemCompleta
      resultado.style.display = "block"
  
      // Scroll suave para o resultado
      setTimeout(() => {
        resultado.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 100)
    }
  
    /**
     * Função para mostrar mensagem de erro
     */
    function mostrarErro(elemento, mensagem) {
      elemento.textContent = mensagem
      elemento.style.display = "block"
    }
  
    /**
     * Função para ocultar todas as mensagens de erro
     */
    function ocultarErros() {
      erroNome.style.display = "none"
      erroData.style.display = "none"
      resultado.style.display = "none"
    }
  }
  
  // Inicializa a aplicação quando o DOM estiver carregado
  document.addEventListener("DOMContentLoaded", inicializarApp)
  