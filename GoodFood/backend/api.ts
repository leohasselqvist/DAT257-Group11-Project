const API_URL = 'http://localhost:8000';

export async function getUser(username: string):Promise<number>{
    const  res = await fetch(API_URL + '/user?username=' + encodeURIComponent(username));
    const data = await res.json();
    console.log(data.id);
    return data.id;
}

export async function addUser(username: string):Promise<number>{
    const res = await fetch(API_URL + '/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify({username: username})
    });
    const data = await res.json();
    return data.id;
}