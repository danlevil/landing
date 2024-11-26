

const databaseURL = "https://landing-c989b-default-rtdb.firebaseio.com/collection.json";

let sendData = () =>{  
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL,{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response =>{
        if(!response.ok){
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result =>{
        alert('Bienvenido a la familia Swiftie');
        form.reset();
        getData();
    })
    .catch(error =>{
        alert('Hubo un problema con tu suscripción. Por favor, inténtalo de nuevo.');
    });
};
let getData = async () =>{  
    try {
        const response = await fetch(databaseURL,{
            method: 'GET'
        });

        if(!response.ok){
            throw new Error('Hemos experimentado un error. ¡Vuelve pronto!');
        }

        const data = await response.json();
        if(data){
            const voteCounts = {};
            for (let key in data) {
                const { albumfavorito } = data[key];
                if (voteCounts[albumfavorito]) {
                    voteCounts[albumfavorito]++;
                } else {
                    voteCounts[albumfavorito] = 1;
                }
            }
            const votantes = document.getElementById('votantes');
            votantes.innerHTML = '';
            let index = 1;
            for(let album in voteCounts){
                votantes.innerHTML += `
                    <tr>
                        <th>${index}</th>
                        <td>${album}</td>
                        <td>${voteCounts[album]}</td>
                    </tr>`;
                index++;
            }
        }
    }catch(error){
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos. Inténtalo más tarde.');
    }
};

let ready = () =>{ 
    console.log('DOM está listo')

    getData();
}
let loaded = (eventLoaded) =>{
    const myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) =>{
        eventSubmit.preventDefault(); 
        sendData();
    });
    getData();
};

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)