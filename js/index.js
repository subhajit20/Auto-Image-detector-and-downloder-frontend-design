const myform = document.getElementById('myform');
const linkfield = document.getElementById('linkfield');
const submit = document.getElementById('submit');
const search = document.getElementById('search');
const myimage = document.getElementById('myimage');
const error = document.getElementById('error');
const loading = document.getElementById('Loading');
// let myimagename = ''

/**
 * 
 * @param {*} imgname imagename
 */
function download_image(imgname) {
    location.href = `https://auto-image-detector-downloader.up.railway.app/v1/download/${imgname}/`;
    // console.log(data)
}

submit.addEventListener('click', async(e) => {
    e.preventDefault()
    async function Get_image() {
        const res = await fetch('https://auto-image-detector-downloader.up.railway.app/v1/scrapimage/', {
            method: 'POST',
            body: JSON.stringify({
                link: linkfield.value
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const data = await res.json();

        return data;
    }

    const data = await Get_image();
    if (data.flag === true) {
        const imagename = data.imagename.split('.')[0]
        download_image(imagename)
    } else {
        console.log(data.msg)
    }
})

async function Search_Image() {
    const res = await fetch('https://auto-image-detector-downloader.up.railway.app/v1/searchimage/', {
        method: 'POST',
        body: JSON.stringify({
            link: linkfield.value
        }),
        headers: {
            'content-type': 'application/json'
        }
    });

    const data = await res.json();
    let response = {};

    if (res.status === 400) {
        response = {
            flag: false,
            msg: data.msg.link
        }
    } else if (res.status === 500) {
        response = {
            flag: false,
            msg: data.msg
        }
    } else if (res.status === 404) {
        response = {
            flag: false,
            msg: data.error
        }
    } else if (res.status === 200) {
        response = {
            flag: true,
            msg: data.imgurl
        }
    }

    return response
}
search.addEventListener('click', async(e) => {
    e.preventDefault()
    const response = await Search_Image();

    if (response.flag === true) {
        loading.style.display = 'block';

        setTimeout(() => {
            loading.innerHTML = '';
            myimage.src = response.msg;
            submit.style.display = 'block';
            loading.style.display = 'none';

        }, 5000)

    } else if (response.flag === false) {
        myimage.src = ''
        submit.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = response.msg

        setTimeout(() => {
            error.style.display = 'none';
            error.innerHTML = ''
        }, 3000)
    }
})

/**
 * Fetching Image from the internet
 */


linkfield.addEventListener('keyup', async(e) => {
    e.preventDefault()
    const response = await Search_Image();

    if (response.flag === true) {
        search.style.display = 'none';
        loading.style.display = 'block';


        setTimeout(() => {
            loading.innerHTML = '';
            myimage.style.display = 'block'
            myimage.src = response.msg;
            submit.style.display = 'block';
            search.style.display = 'none';
            loading.style.display = 'none';

        }, 2000)
    } else if (response.flag === false) {
        search.style.display = 'none';
        loading.style.display = 'block';


        setTimeout(() => {
            loading.innerHTML = ''
            myimage.style.display = 'none'
            myimage.src = ''
            submit.style.display = 'none';
            search.style.display = 'block';
            error.style.display = 'block'
            error.innerHTML = response.msg
            loading.style.display = 'none';

            setTimeout(() => {
                error.style.display = 'none'
                error.innerHTML = ''
            }, 3000)
        }, 2000)
    } else if (e.target.value < 0) {
        submit.style.display = 'none';
    }
})