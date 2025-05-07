import http from 'k6/http';
import { sleep, check } from 'k6';

const CMS_URL = 'http://localhost:5001';
const AUTH_URL = 'http://localhost:5000';
const LOGIN_ENDPOINT = `${AUTH_URL}/auth/login-admin`;

export const options = {
    stages: [
        { duration: '10s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 0 }, 
    ],
};


const test_user = {
    email: "admin@example.com",
    password: "securepass",
};

export function setup() {
    const res = http.post(LOGIN_ENDPOINT, JSON.stringify(test_user), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    check(res, {
        'admin login successful': (r) => r.status === 200,
    });
    
    const data = res.json();
    return {
        token: data.access_token,
        user_id: data.user_id,
    };
}

export default function(data) {
    const headers = {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
    }

    let add_book = http.post(`${CMS_URL}`, 
        JSON.stringify({
            title: "Book 1",
            author: "Author 1",
            language: "English"
        }),
        { headers }
    );
    check(add_book, { 'add book is successful': (r)=> r.status === 201});
    let book_id = add_book.json()['_id'];
    
    let edit_book = http.put(`${CMS_URL}/${book_id}`,
        JSON.stringify({
            tite: "Updated Title"
        }),
        { headers}
    );
    check(edit_book, {' edit book is successful': (r)=> r.status === 200});

    let delete_book = http.del(`${CMS_URL}/${book_id}`,
        {headers}
    );
    check(delete_book, {'delete book is successful': (r)=> r.status === 200});
    sleep(1);
}