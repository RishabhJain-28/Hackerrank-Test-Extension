const form = document.getElementById('login');
const loading = document.querySelector('.loading');
const msgUI = document.querySelector('.msg');
const alertMsg = document.querySelector('.alert-msg');
form.addEventListener('submit',auth);
const invInput = document.getElementById('invUsername'); 
const passInput = document.getElementById('invPassword'); 
async function auth(e){
    e.preventDefault();
    loading.style.display = 'block';
    
    
    
    try{
        const jwt =await fetch('http://localhost:3000/test/invigilator/invAuth',{
            method:'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                inv: invInput.value,
                password: passInput.value
            })
        });
        
        if(!jwt.ok){
            throw new Error(await jwt.text());
        }
        const token = await jwt.text();
        localStorage.setItem('jwt',token);
       
        const result = await fetch('http://localhost:3000/test/invigilator/',{
            headers:{
                'x-auth-token':localStorage.getItem('jwt')
            }
        })
        if(!result.ok){
            throw new Error(await result.text());
        }
        
        const a= await result.text();
        console.log(a);
        
       
        showMsgOnUI('Logged In',true);
        
        if(document.referrer)
            window.open(document.referrer,'_self');
        else window.open('http://localhost:3000/test/invigilator/','_self')
    }catch(ex){
      showMsgOnUI(ex.message,false);
    }
    
}

function showMsgOnUI(msg,status){
    // console.log(msg);
    // console.log('a');

    loading.style.display = 'none';

    const classStatus = (status)? 'success':'danger' ;   
   
    msgUI.className += classStatus;

    alertMsg.className = `alert-msg alert alert-dismissible alert-${classStatus} `;
    alertMsg.innerHTML = `
    <strong>${msg}</strong>
    `;
    msgUI.style.display = 'block';
    setTimeout(()=>{
        msgUI.style.display = 'none';
    },3000);

}