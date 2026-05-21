import fs from 'fs';

async function test() {
    fs.writeFileSync('dummy.jpg', 'dummy');
    
    // Using native Blob instead of file streams
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    const form = new FormData();
    form.append('file', blob, 'dummy.jpg');

    try {
        const res = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log("RESPONSE:", data);
    } catch (e) {
        console.log("ERROR:", e);
    }
}
test();
