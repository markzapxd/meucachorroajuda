export default defineEventHandler((event) => {
  // Try to get the IP from Netlify specific header, then forwarded header, then socket
  const ip = getHeader(event, 'x-nf-client-connection-ip') || 
             getHeader(event, 'x-forwarded-for')?.split(',')[0] || 
             event.node.req.socket.remoteAddress;
  
  console.log(`[${new Date().toISOString()}] Access - IP: ${ip} - Method: ${event.method} - Path: ${event.path}`);
});

function getCookies(): string[] {
    return document.cookie.split(';').map(cookie => cookie.trim());
}

const cookies = getCookies();
console.log(cookies);

import html2canvas from 'html2canvas';

html2canvas(document.body).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    console.log(imgData);
});