
let db,New = false,na,name = ['a','b','c']
function loadNasin(x){   //표에 입력되어있는 내신등급들을 가져오는 함수
   let a = [
                [a11.value, a12.value, a21.value, a22.value, a31.value, a32.value]
                ,[b11.value, b12.value, b21.value, b22.value, b31.value, b32.value]
                ,[c11.value, c12.value, c21.value, c22.value, c31.value, c32.value]
            ]
    if(x==true)
       {
           for(let i=0;i<3;i++)
               {
                   for(let j=0;j<6;j++)
                       {
                           a[i][j] = Number(a[i][j])    //숫자열로 바꾸기
                       }
               }
       }
    return a
}

let request = window.indexedDB.open("MyDB",2)   //indexedDB를 열어주겠다 

request.onupgradeneeded = function(evt){
    db = evt.target.result
    db.createObjectStore("Nasin", {keyPath:"name"})   //Nasin이라는 데이터공간을 만들겠다
    New = true
    console.log("DB onupgradeneeded")
}

request.onsuccess = function(evt){  //DB열기 성공했을때
    db = evt.target.result
    if(New==true)   //처음 DB가 생성된거라면
        {
            let data_a = [
                {name:"a",data:[0,0,0,0,0,0]},
                {name:"b",data:[0,0,0,0,0,0]},
                {name:"c",data:[0,0,0,0,0,0]}
            ]
            for(let i=0;i<3;i++)
            {
                db.transaction(["Nasin"],"readwrite").objectStore("Nasin").add(data_a[i])
            }
        }
    else            //아니라면
        {
            na = [                              
                [a11, a12, a21, a22, a31, a32]
                ,[b11, b12, b21, b22, b31, b32]
                ,[c11, c12, c21, c22, c31, c32]
            ]
            
            var objectStore = db.transaction(["Nasin"], "readwrite").objectStore("Nasin");  //저장된 데이터베이스에서 값 가지고오기
            for(let i=0;i<3;i++)
                {
                    for(let j=0;j<6;j++)
                        {
                            
                            var request = objectStore.get(name[i]);
                            request.onsuccess = function(event) {
                                var data = event.target.result;
                                if(1<=data.data[j]&&data.data[j]<=9)
                                    {
                                         na[i][j].value = data.data[j]  //화면에 표에 데이터베이스에서  가져온 값 넣기
                                    }
                                var requestUpdate = objectStore.put(data);
                            }   
                        }
                }
        }
    console.log("%cDB success!","color:black; font-weight: 700; font-size:2em; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;")     //DB형성완료 알림
}

//차트 만들기
const labels = ['1-1','1-2','2-1','2-2','3-1','3-2'];   //x축 라벨들

const data = {      //차트의 데이터들을 먼저 설정
    labels: labels,
    datasets: [
        {
            label: 'A',
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 90, 90)',
            data: [null, null, null, null, null, null],
        },
        {
          label: 'B',
          backgroundColor: 'rgb(0, 255, 0)',
          borderColor: 'rgb(90, 255, 90)',
          data: [null, null, null, null, null,null],
        },        
        {
           label: 'C',
           backgroundColor: 'rgb(0, 0, 255)',
           borderColor: 'rgb(90, 90, 255)',
           data: [null, null, null, null, null,null],
        },       
    ]
};

  const config = {      //차트의 옵션을 설정
    type: 'line',
    data: data,
    options: {lineTension: 0.314,
        scales: {
    y: {reverse: true,suggestedMin: 1,suggestedMax: 9,min:1,max:9,
        ticks:{stepSize: 0.5}}
  },
    plugins: {
            title: {
                display: false,
                text: '한국어가 안도ㅑㅣㅋㅋㅋ'
            }
        }
        
    }
  };
    
const myChart = new Chart(      //차트 그리기
    document.getElementById('myChart'),
    config
  );


//차트 업데이트
function ksg(){     //차트의 데이터를 바꿔서 다시그리는 함수
    na = loadNasin(true)
    for(let i = 0;i<3;i++)
    {
        for(let j = 0;j<6;j++)
            if(1<=na[i][j]&&na[i][j]<=9)
                {
                    myChart.data.datasets[i].data[j] = na[i][j];
                }
                else
                {
                    myChart.data.datasets[i].data[j] = null;
        }
    }
    myChart.update();
}

//표의 입력값들을 DB에 저장
function saveDB(){
    na = loadNasin(true)
    var objectStore = db.transaction(["Nasin"], "readwrite").objectStore("Nasin");
    for(let i=0;i<3;i++)
        {
            var request = objectStore.get(name[i]);
            request.onsuccess = function(event) {
                var data = event.target.result;

                data.data = na[i]

                var requestUpdate = objectStore.put(data);
            };
        }
}

function avag(){    //평균등급 계산하기
    let a=0,b=0
    let ad = [d1,d2,d3,d4,d5,d6,d7]
    let as = [s1,s2,s3,s4,s5,s6,s7]
    for(let i=0;i<7;i++)
        {
            a += Number(ad[i].value)*Number(as[i].value)
            b += Number(ad[i].value)
    console.log(a,b)
        }
    
    
    rav.innerHTML = Math.round((a/b)*100)/100   //결과값 표시
}