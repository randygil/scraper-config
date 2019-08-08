// ==UserScript==
// @name         Scrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scraper appliancerepairmen
// @author       Randy Gil
// @match        http://technician.theappliancerepairmen.com/artis-tech-home/available-jobs/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource    w3css https://www.w3schools.com/w3css/4/w3.css
// @grant              GM_getValue
// @grant              GM_setValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// ==/UserScript==

document.head.appendChild(cssElement(GM_getResourceURL ("w3css")));

function cssElement(url) {
  let link = document.createElement("link");
  link.href = url;
  link.rel="stylesheet";
  link.type="text/css";
  return link;
}


let fillTable
const DEBUG = true;

(function() {


    let STOP = false
    let CONFIG = JSON.parse(localStorage.getItem('config'))

    if (!CONFIG) {
       CONFIG = {
          appliance: '',
          paymentMethod: '',
          zones: []
       }
    }



    function addVueApp() {
        let D = document;
        let targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        let scriptNode = D.createElement ('script');
        scriptNode.src = DEBUG ? 'http://localhost:8080/dist/build.js' : 'https://cdn.jsdelivr.net/gh/randygil/scraper-config@master/dist/build.js';

        targ.appendChild (scriptNode);
    }

    let tabID = sessionStorage.tabID && sessionStorage.closedLastTab !== '2' ? sessionStorage.tabID : sessionStorage.tabID = Math.random();
        sessionStorage.closedLastTab = '2';
        $(window).on('unload beforeunload', function() {
            sessionStorage.closedLastTab = '1';
        });

    function isEnabled() {
      return localStorage.getItem('enable') === tabID
    }
    function dateToString(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }

    let vueApp = document.createElement ('div');
    vueApp.id = 'app'
    let body = document.querySelector('body')
    body.appendChild(vueApp)
     addVueApp()

    /* Inicio del script */

    let list = []
    let jobs = $("#availablejobs").children('.left.even')
    $.each(jobs,function(a,e) {

        let content = $(e).first().children('.span-12').first()
        let jobn = $($(content).children('.span-6')[0]).text()
        let location = $($(content).children('.span-6')[1]).text()
        let schedule = $($(content).children('.span-6')[2]).text()
        let appliance = $($(content).children('.span-4')[4]).text()
        let brand = $($(content).children('.span-4')[6]).text()
        let paymentMethod = $($(content).children('.span-4')[8]).text()
        let serviceFee = $($(content).children('.span-6')[3]).text()

        let jobType = $($(content).children('.span-6')[13]).text()

        let symptoms = $($(content).children('.span-12')[0]).text()
        list.push({
            job: jobn,
            location: location.toLowerCase(),
            appliance: appliance.toLowerCase(),
            brand: brand.toLowerCase(),
            schedule: schedule.toLowerCase(),
            paymentMethod: paymentMethod.toLowerCase(),
            serviceFee: serviceFee.toLowerCase(),
            symptoms: symptoms.toLowerCase(),
        })
    });

    //let zone = GM_config.get('zone')

    let filtersZone = []

    for (let zone of CONFIG.zones) {


        if (zone.status) {
            let configs = zone.zipcode.split('\n')

            filtersZone = filtersZone.concat(configs)
        }
    }

    let filtersAppliance = CONFIG.appliance.split('\n')

    let filtersPaymentMethod = CONFIG.paymentMethod.split('\n')
    filtersPaymentMethod = filtersPaymentMethod.map((e) => e.toLowerCase())

    if (DEBUG) {
        list = [
            {
                job: '123123',
                appliance: 'Refrigerator (Side By Side)',
                location: ' ...terrace, doral Florida 33178',
                paymentMethod: 'credit card',
                schedule: 'August 8, 2019 9 AM-11 AM',
                symptoms: 'prueba de simtomas'
            }
        ]
    }

    //console.log(list)
    //console.log(filtersZone)



    if (isEnabled()) {

      $("body").prepend('<a class="btn btn-danger" href="" id="toggleEnable">Desactivar Scraper</a>')
    }else {
      $("body").prepend('<a class="btn btn-danger"  href="" id="toggleEnable">Activar Scraper</a>')
    }


    $("#toggleEnable").click(function(e) {
        e.preventDefault();
       if (!isEnabled()) {
           localStorage.setItem('enable', tabID)
           alert('Activado en esta pestaña')
           window.location.reload()
       } else {
           localStorage.removeItem('enable')
           alert('Desactivado en esta pestaña')
           STOP = true

       }

    });


   // $("body").prepend(`<a class="btn btn-primary"  href="" id="openconfig">Configurar scraper (${filtersZone.length}) ${DEBUG == true ? '- Desarrollo': ''} </a>`)


    if (CONFIG.status == 'Activo') {
        $("body").prepend('<a class="btn btn-primary" href="" id="toggleStatus">Detener scraper</a>')
    }


    $("#openconfig").click(function(e) {
        e.preventDefault();
        GM_config.open();
        STOP = true;

    });
   $("#toggleStatus").click(function(e) {
       e.preventDefault();
       alert('detenido');
       STOP = true;

    });

    let status = CONFIG.status
    let jobsList = localStorage.getItem('jobs') ? JSON.parse(localStorage.getItem('jobs')) : [];

    if (status == 'Activo' && isEnabled()) {
        console.log('activo')
        let matches = []

        let elements = list.filter((elem, index) => {


            let findCodeMatch
            let zipCodeMatch = CONFIG.zones.find((zone) => {
                if (zone && zone.status) {

                   


                    let f = elem.schedule


                    let month = f.split(',')[0].split(' ')[0]
                    let day = f.split(',')[0].split(' ')[1]
                    let year = f.split(',')[1].trim().split(' ')[0]
                    let hourA = parseInt(f.split(',')[1].trim().split(' ')[1])
                    let ttA = f.split(',')[1].trim().split(' ')[2].split('-')[0]

                    if (ttA == 'NN') {
                       hourA = 0;
                        ttA = 'PM'
                    }
                    if (ttA == 'PM') {
                        hourA +=12
                    }
                    let hourB = parseInt(f.split(',')[1].trim().split(' ')[2].split('-')[1])
                    let ttB =  f.split(',')[1].trim().split(' ')[3]


                    if (ttB == 'NN') {
                       hourB = 0;
                       ttB = 'PM'
                    }
                    if (ttB == 'PM') {
                        hourB +=12
                    }
                    console.log('hourA', hourA)
                    hourA = new Date(`${year}-${month}-${day} ${hourA}:00`)
                    hourB = new Date(`${year}-${month}-${day} ${hourB}:00`)

                    let from = new Date(`${year}-${month}-${day}`)
                    from.setHours(zone.timeStart.split(':')[0])
                    from.setMinutes(zone.timeStart.split(':')[1])

                    let to = new Date(`${year}-${month}-${day}`)
                    to.setHours(zone.timeEnd.split(':')[0])
                    to.setMinutes(zone.timeEnd.split(':')[1])
                    const today = new Date()
                        console.log(`${hourA} >= ${from} && ${hourA} <= ${to} && ${hourB} <= ${to}`)

                    if (!(hourA >= from && hourA <= to && hourB <= to )) {
                        return false
                    }

                    const find = zone.dates.filter((date) => {
                        date = dateToString(new Date(date))
                        return date == dateToString(hourB)
                      })

                   if (find[0]) {
                       return false
                   }
                    const zipcodes = zone.zipcode.split('\n')

                    let findzipCodeMatch = zipcodes.find((zipcode) => {
                        if (zipcode) {
                            let res = elem.location.includes(zipcode)
                            return res
                        }
                    })
                    findCodeMatch = findzipCodeMatch
                    return findzipCodeMatch


                }

            })
           console.log(zipCodeMatch)


            let paymentMethodMatch = filtersPaymentMethod.find((paymentMethod) => {
                if (paymentMethod) {
                    let res = elem.paymentMethod.includes(paymentMethod.toLowerCase())
                    return res
                }
            })

            let applianceMatch = filtersAppliance.find((appliance) => {
                if (appliance) {
                    let res = elem.appliance.toLowerCase().includes(appliance.toLowerCase())
                    return res
                }
            })

            // console.log(findCodeMatch, applianceMatch, paymentMethodMatch)

            elem.match = {}
            if (zipCodeMatch) {
              elem.match.location = findCodeMatch
            }
            if (applianceMatch) {
              elem.match.appliance = applianceMatch
            }
            if (paymentMethodMatch) {
              elem.match.paymentMethod = paymentMethodMatch
            }

            console.log('match', elem.match)
            list[index] = elem

            if (!!zipCodeMatch && !!applianceMatch && !!paymentMethodMatch) {

                return true
            }


        }, [])

        //console.log(list)
        for (let e=0; e<= list.length; e++) {

            let actualJob = list[e]
            if (actualJob) {
                //console.log('actualJob', actualJob)
                let findJob = jobsList.find((e) => { return e.job === actualJob.job } )

                if (!findJob) { jobsList.unshift(actualJob) }
            }
        }
        localStorage.setItem('jobs', JSON.stringify(jobsList));
        if (elements.length>0) {
            let job = elements[0]
            let localjobs = localStorage.getItem('jobsAccepted') ? JSON.parse(localStorage.getItem('jobsAccepted')) : [];

            localjobs.unshift(job)
            localStorage.setItem('jobsAccepted', JSON.stringify(localjobs) );
            let url = DEBUG ? 'http://localhost:8000/notify.php' : 'http://localhost/scraper/notify.php'
            const data = {
               action: 'jobAccepted',
               ...job
            }


            fetch(url,{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            }).then((e) => {
              e.text()
            }).then((e) => {
               console.log(e)
            })

               if (!DEBUG) {
                   $('#book-'+elements[0].job).submit();
               } else {
                   alert('¡Simulacro! Aceptaré el trabajo n° '+job.job)
               }
        }





        setTimeout(function() {
            if (!STOP) {
                window.location.reload()
            }
        }, CONFIG.interval*1000)

    }


    let tableContent = `
<table class="w3-table w3-bordered w3-striped w3-border test w3-hoverable">
<thead>
<tr class="w3-green">
  <th>Fecha</th>
  <th>Numero</th>
  <th>Location</th>
  <th>Appliance</th>
  <th>Payment</th>
  <th>Symptoms</th>
</tr>
</thead>
<tbody id="jobsList">
`;


    tableContent += `</tbody><tbody>
    </tbody>
    </table>`;
    let modalhtml = `
  <div id="id01" class="w3-modal">
    <div class="w3-modal-content" style="    width: 100%;>
      <div class="w3-container">
        <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-display-topright">&times;</span>
        ${tableContent}
<button class="w3-btn w3-black" id="prevPage" >Atras</button>
<button class="w3-btn w3-black" id="nextPage" >Siguiente</button>
<button class="w3-btn w3-black" id="descargarCsv" >Exportar</button>

      </div>
    </div>
  </div>


`;

    $("body").prepend('<a class="btn btn-success" href="" id="openHistorial">Ver historial</a>')

    $("#openHistorial").click(function(event) {
         STOP = true;
        event.preventDefault();
        document.getElementById('id01').style.display='block'
    });
    function paginate (array, page_size, page_number) {
        --page_number; // because pages logically start with 1, but technically with 0
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }


    function fillTable(page_number) {
        let jobsPaginated = paginate(jobsList, 6, pageNumber)
         let tableContent = ''

         $("#jobsList").html('')

        for (const j of jobsPaginated) {
       tableContent += `<tr>
           <td>${j.schedule}</td>
           <td>${j.job}</td>
           <td>${j.location} ${j.match.location ? `<strong>(${j.match.location})</strong>` : ''}</td>
           <td>${j.appliance} ${j.match.appliance ? `<strong>(${j.match.appliance})</strong>` : ''}</td>
            <td>${j.paymentMethod} ${j.match.paymentMethod ? `<strong>(${j.match.paymentMethod})</strong>` : ''}</td>
           <td>${j.symptoms}</td>
        </tr>
       `;
       $("#jobsList").html(tableContent)
    }
    }

    function downloadCsv() {
       let csv = ''
       const items = jobsList
        csv += `Job N°, Schedule, Location, Appliance, Payment Method, Symptons \r\n`

       // Loop the array of objects
       console.log(items.length)
       for(let row = 0; row < items.length; row++){
           let keysAmount = Object.keys(items[row]).length
           let keysCounter = 0

           
          
           
           

               let j = items[row]
               if (!j.match) {
                   j.match = {}
               }
               let fila = `${j.job}, ${j.schedule},${j.location} ${j.match.location ? `(${j.match.location})` : ''}, ${j.appliance} ${j.match.appliance ? `(${j.match.appliance})` : ''}, ${j.paymentMethod} ${j.match.paymentMethod ? `(${j.match.paymentMethod})` : ''}, ${j.symptoms}`
               csv += fila + '\r\n'
               keysCounter++
           


           keysCounter = 0
       }

        // Once we are done looping, download the .csv by creating a link
        let link = document.createElement('a')
        link.id = 'download-csv'
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
        link.setAttribute('download', 'export-jobs.csv');
        document.body.appendChild(link)
        document.querySelector('#download-csv').click()

    }

    $('body').prepend(modalhtml)
    let pageNumber = 1
    $("#prevPage").click(function() {
        if (pageNumber > 1) {
           pageNumber--;
           fillTable(pageNumber)
        }
    });
    $("#nextPage").click(function() {
           pageNumber++
           fillTable(pageNumber)
    });
    fillTable(pageNumber)
      $('#descargarCsv').click(function(e) {
        e.preventDefault();
        console.log('click')
        downloadCsv()
    });
})();
