function enviarPedido() {
    var prato1 = document.getElementById('prato1').value;
    var prato2 = document.getElementById('prato2').value;
    var observacao = document.getElementById('observacao').value;

    var mensagem = "pedido:\n";
    if (prato1 > 0) {
        mensagem += "🍽️ Prato 1:* " + prato1 + "unidade(s)\n";
    } if (prato2 > 0) {
        mensagem += "prato 2: " + prato2 + "unidade(s)\n";
    } if (observacao) {
        mensagem +="Observação: " + observacao + "\n";
    }

    var url = "https://wa.me/5585994066861?text=" + encodeURIComponent(mensagem);
        window.open(url, '_blank').focus();
    
}

