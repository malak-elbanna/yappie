import http from 'k6/http';
import { check, sleep } from 'k6';
import { login_user } from './setup.js';

const PROFILE_URL = 'http://localhost:5005';

export const options = {
    stages: [
        { duration: '10s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 0 }, 
    ],
};


const test_user = {
    name: "test user",
    email: "testUser@example.com",
    password: "securePassword12$",
};

export function setup() {
    return login_user(test_user);
}

export default function (data) {
    const headers = {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
    }

    let get_info = http.get(`${PROFILE_URL}/${data.user_id}`, { headers });
    check(get_info, { 'get info successful': (r) => r.status === 200});

    let edit_bio = http.put(`${PROFILE_URL}/${data.user_id}/edit-bio`, 
        JSON.stringify({ bio: "K6 BIO TESTING"}),
        {headers}
    );
    check(edit_bio, { 'edit-bio successful': (r) => r.status === 200});
    
    let add_preference = http.put(`${PROFILE_URL}/${data.user_id}/add-preference`, 
        JSON.stringify({type: 'audiobooks', genre: 'Fantasy'}),
        {headers}
    );
    check(add_preference, {'add-preference successful': (r) => r.status === 200});

    let remove_preference = http.put(`${PROFILE_URL}/${data.user_id}/remove-preference`,
        JSON.stringify({type: 'audiobooks', genre: 'Fantasy'}),
        {headers}
    );
    check(remove_preference, {'remove-preference successful': (r) => r.status === 200});


    sleep(1);
}