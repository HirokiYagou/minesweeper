function record() {
  const submit = document.getElementById('submit');
  submit.addEventListener('click', (e) => {
    const formData = new FormData(document.getElementById('form'));
    const XHR = new XMLHttpRequest();
    XHR.open('POST', '/games', true);
    XHR.responseType = 'json';
    XHR.send(formData);
    XHR.onload = () => {
      if (XHR.status !== 200) {
        alert(`ERROR${XHR.status}: ${XHR.statusText}`);
        return null;
      }
      const HTML = XHR.response.html;
      const recordData = document.getElementById('record-datas');
      console.log(HTML)
      while(recordData.firstChild){
        recordData.removeChild(recordData.firstChild);
      }
      recordData.insertAdjacentHTML('beforeend', HTML);
    };
    e.preventDefault();
    // document.getElementById('form-comment').setAttribute('type', 'hidden');
    document.getElementById('submit').setAttribute('type', 'hidden');
  })
}

window.addEventListener("DOMContentLoaded", record)