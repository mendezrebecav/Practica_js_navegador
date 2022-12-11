//Variables que apuntan a etiquetas correspondientes en HTML //
const lista_ahorro = document.querySelector('#ahorro')
const lista_ingresos = document.querySelector('#id_ingresos')
const lista_gastos = document.querySelector('#gastos')

const nueva_transaccion = document.querySelector('#id_transaccion')
const transaccion_registrada = document.querySelector('#id_historial_almacenado')

// Variables utilizadas para las diferentes transacciones //
let ahorro_actual
let gasto_actual_ahorrado
let resultado_ingresos 
let resultado_gastos
let resultados_guardados
let ahorros_modificados
let lista_inicial = []

configuracion_numeros_mostrados()
proceso_historial()

nueva_transaccion.addEventListener('submit', (event) => {
    event.preventDefault();

    const numero_max = 1000
    const concepto_principal = document.querySelector('#concept');
    const concepto_importe = document.querySelector('#amount');
    

    let transaction = {
        concept: concepto_principal.value,
        amount: parseFloat(concepto_importe.value),
        id: Math.floor(Math.random() * numero_max),
    }
    lista_inicial.push(transaction)

    localStorage.setItem('historial_trassacion_tienda', JSON.stringify(lista_inicial));

    concepto_principal.value = '';
    concepto_importe.value = '';

    registros_historicos(transaction);
    adicion_general(transaction.amount);
})

function proceso_historial() {
    let transactionSavedHistory = JSON.parse(localStorage.getItem('historial_trassacion_tienda'));
    console.log(transactionSavedHistory)

    if (transactionSavedHistory !== null) {
        for (let i = 0; i < transactionSavedHistory.length; i++) {
            registros_historicos(transactionSavedHistory[i]);
            lista_inicial.push(transactionSavedHistory[i])
        }
    }
    
}

function configuracion_numeros_mostrados(){
    ahorro_actual = JSON.parse(localStorage.getItem('los_ingresos_almacenados'));
    dibujar_pantalla_2(ahorro_actual)

    gasto_actual_ahorrado = JSON.parse(localStorage.getItem('los_gastos_almacenados'));
    dibujar_pantalla_3(gasto_actual_ahorrado)

    ahorros_modificados = JSON.parse(localStorage.getItem('los_ahorros_almacenados'));
    dibujar_pantalla(ahorros_modificados)
}

function almacenamiento_general(income, expenses, savings) {
    
    let los_ingresos_almacenados = income
    localStorage.setItem('los_ingresos_almacenados', JSON.stringify(los_ingresos_almacenados))

    let los_gastos_almacenados = expenses
    localStorage.setItem('los_gastos_almacenados', JSON.stringify(los_gastos_almacenados))
    
    let los_ahorros_almacenados = savings
    localStorage.setItem('los_ahorros_almacenados', JSON.stringify(los_ahorros_almacenados))

}

function adicion_general(amount) {
    
    if (amount > 0) {
        resultado_ingresos = ahorro_actual + parseFloat(amount)
        ahorro_actual = resultado_ingresos
        dibujar_pantalla_2(ahorro_actual)

        resultados_guardados = ahorros_modificados + parseFloat(amount)
        ahorros_modificados = resultados_guardados
    } else {
        resultado_gastos = gasto_actual_ahorrado + (-parseFloat(amount))
        gasto_actual_ahorrado = resultado_gastos
        dibujar_pantalla_3(gasto_actual_ahorrado)

        resultados_guardados = ahorros_modificados + parseFloat(amount)
        ahorros_modificados = resultados_guardados
    }

    almacenamiento_general(ahorro_actual, gasto_actual_ahorrado, ahorros_modificados)
    dibujar_pantalla(ahorros_modificados)

}

function dibujar_pantalla(savings) {
    const ahorro_almacenado = document.querySelector('#ahorro_almacenado')
    let displaySavings

    if (savings !== null) {
        if (savings >= 0) {
            displaySavings = `
            <p class="ahorro_positivo">${savings}€</p>
            `
        } else {
            displaySavings = `
            <p class="ahorro_negativo">${savings}€</p>
            `
        }  
    } else {
        displaySavings = `
        <p class="ahorro_positivo">0.00€</p>
        `
    }
    ahorro_almacenado.innerHTML = displaySavings;
    lista_ahorro.appendChild(ahorro_almacenado);
}

function dibujar_pantalla_2(income) {
    const id_ingresos_almacenados = document.querySelector('#id_ingresos_almacenados')
    let displayIncome

    if (income !== null) {
        displayIncome = `
        <p>${income}€</p>
        `
    } else {
        displayIncome = `
        <p>0.00€</p>
        ` 
    }
    id_ingresos_almacenados.innerHTML = displayIncome;
    lista_ingresos.appendChild(id_ingresos_almacenados);

}

function dibujar_pantalla_3(expenses) {
    const id_gastos = document.querySelector('#id_gastos')
    let displayExpenses 
    
    if (expenses !== null) {
        displayExpenses = `
        <p>${expenses}€</p>
        `
    } else {
        displayExpenses = `
        <p>0.00€</p>
        `
    }
    id_gastos.innerHTML = displayExpenses;
    lista_gastos.appendChild(id_gastos);
}

function registros_historicos(transaction) {
    const historyElement = document.createElement('li');

    historyElement.setAttribute('id', transaction.id)

    let transactionElement
    if (transaction.amount > 0){
        transactionElement = `
        <div class="transaccion_positiva">
            <p class="concepto_tratado">${transaction.concept}</p>
            <p class="transaccion_ingreso">${transaction.amount}€</p>
            <button class='boton_eliminador' onclick = 'eliminar_todo_historial(${transaction.id}, ${transaction.amount})'>Eliminar</button>
        </div> `
    } else {
        transactionElement = `
        <div class="transaccion_negativa">
            <p class="concepto_tratado">${transaction.concept}</p>
            <p class="transaccion_monto_negativo">${transaction.amount}€</p>
            <button class='boton_eliminador' onclick = 'eliminar_todo_historial(${transaction.id}, ${transaction.amount})'>Eliminar</button>
        </div> `
    }
    
    historyElement.innerHTML = transactionElement;

    transaccion_registrada.appendChild(historyElement);
}

function eliminar_todo_historial(id, amount) {
    console.log(id);

    const transactionElement = document.getElementById(id);
    transactionElement.remove();
    eliminar_todas_transacciones(amount);
    eliminar_datos(id);
    
}

function eliminar_datos(id) {
    for (let i = 0; i < lista_inicial.length; i++) {
        if(lista_inicial[i].id == id) {
            lista_inicial.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('historial_trassacion_tienda', JSON.stringify(lista_inicial));
}

function eliminar_todas_transacciones(amount) {
    
    if (amount > 0) {
        let resultado_ingresos = ahorro_actual - amount
        ahorro_actual = resultado_ingresos

        dibujar_pantalla_2(resultado_ingresos)

    } else {
        let resultado_gastos = gasto_actual_ahorrado - (-amount)
        gasto_actual_ahorrado = resultado_gastos

        dibujar_pantalla_3(resultado_gastos)
    }

    let resultados_guardados = ahorros_modificados - amount
    ahorros_modificados = resultados_guardados

    dibujar_pantalla(resultados_guardados)
    almacenamiento_general(ahorro_actual, gasto_actual_ahorrado, ahorros_modificados)
}

