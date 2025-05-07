import http from 'k6/http';
import { check, sleep } from 'k6';

const AUTH_URL = 'http://localhost:5000';
const PROFILE_URL = 'http://localhost:5005';
const LOGIN_ENDPOINT = `${AUTH_URL}/auth/login`;

export const options = {
    vus: 50,
    duration: '30s',
};

const test_user = {
    name: "test user",
    email: "testUser@example.com",
    password: "securePassword12$",
};

export function setup() {
    const res = http.post(LOGIN_ENDPOINT, JSON.stringify(test_user), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    check(res, {
        'login successful': (r) => r.status === 200,
    });
    
    const data = res.json();
    return {
        token: data.access_token,
        user_id: data.user_id,
    };
}

export default function (data) {
    const headers = {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
    }

    let get_info = http.get(`${PROFILE_URL}/${data.user_id}`, { headers });
    check(get_info, { 'get info successfull': (r) => r.status === 200});

    let edit_bio = http.put(`${PROFILE_URL}/${data.user_id}/edit-bio`, 
        JSON.stringify({ bio: "K6 BIO TESTING"}),
        {headers}
    );
    check(edit_bio, { 'edit-bio successfull': (r) => r.status === 200});
    
    let add_preference = http.put(`${PROFILE_URL}/${data.user_id}/add-preference`, 
        JSON.stringify({type: 'audiobooks', genre: 'Fantasy'}),
        {headers}
    );
    check(add_preference, {'add-preference successfull': (r) => r.status === 200});

    let remove_preference = http.put(`${PROFILE_URL}/${data.user_id}/remove-preference`,
        JSON.stringify({type: 'audiobooks', genre: 'Fantasy'}),
        {headers}
    );
    check(remove_preference, {'remove-preference successfull': (r) => r.status === 200});


    sleep(1);
}