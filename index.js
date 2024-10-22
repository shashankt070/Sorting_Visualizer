const generateNewArray = document.querySelector('#generate');
const select = document.querySelector('#sortingalgo');
const sort = document.querySelector('#sort');
const visual = document.querySelector('.visual');
const smallArray = document.querySelector('#small');
const largeArray = document.querySelector('#large');
const slow = document.querySelector('#slow');
const fast = document.querySelector('#fast');
const live = document.querySelector('#live');
live.style.background = '#FF0000';
slow.checked = true;
fast.checked = false;
smallArray.checked = true;
largeArray.checked = false;
let arr;
let bars;
let speed = 70;
function speedchange(selected)
{
    if(selected == 'slow')
    {
        slow.checked = true;
        fast.checked = false;
        speed = '';
        speed = 70;
    }
    else
    {
        fast.checked = true;
        slow.checked = false;
        speed = '';
        speed = 20;
    }
}

function sizechange(selected)
{
    if(selected == 'small')
    {
        smallArray.checked = true;
        largeArray.checked = false;
    }
    else
    {
        largeArray.checked = true;
        smallArray.checked = false;
    }

    generate();
}

function generate() {
    arr = []; 
    bars = [];
    let wid = parseInt(visual.offsetWidth/10);
    wid = wid-4;
    if (smallArray.checked) {
        let min = 30;
        if(wid<65)
        min = 15;
        for (let i = 0; i < min; i++) {
            arr.push(Math.floor(Math.random() * (250 - 5 + 1)) + 5);
        }
    } else {
        min = 60;
        if(wid<70)
        min = 30;
        for (let i = 0; i < min; i++) {
            arr.push(Math.floor(Math.random() * (250 - 5 + 1)) + 5);
        }
    }
    fill(arr, bars);
}

function fill(arr, bars) {
    visual.innerHTML = ''; 
    visual.style.position = 'relative'; 

    const barWidth = 10; 
    const spacing = 2; 
    const totalWidth = arr.length * (barWidth + spacing); 

    for (let i = 0; i < arr.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.setAttribute('style', `width: ${barWidth}px; height: ${Math.min(2*arr[i], visual.offsetHeight-10)}px; background-color : #DC143C ; position: absolute; bottom: 0; left: ${(visual.clientWidth - totalWidth) / 2 + i * (barWidth + spacing)}px;`);
        visual.appendChild(bar); 
        bars.push(bar);
    }
}

function updateUI(arr, bars, i, j)
{
    bars[i].style.height = `${Math.min(2*arr[i], visual.offsetHeight)}px`;
    bars[j].style.height = `${Math.min(2*arr[j], visual.offsetHeight)}px`;
}

async function Sort()
{
    disableButtons();
    let val = parseInt(select.value);
    if(val == 1)
    await bubbleSort(arr, bars, speed);
    if(val == 2)
    await insertionSort(arr, bars, speed);
    if(val == 3)
    await selectionSort(arr, bars, speed);
    if(val == 4)
    await mergeSort(arr, 0, arr.length-1, bars, speed);
    if(val == 5)
    await quickSort(arr, 0, arr.length-1);
    if(val == 6)
    await heapsort(arr, 0, arr.length-1, bars, speed);
    enableButtons();
}

function disableButtons() {
    generateNewArray.classList.add('disabled');
    sort.classList.add('disabled');
    select.classList.add('disabled');
    smallArray.classList.add('disabled');
    largeArray.classList.add('disabled');
    slow.classList.add('disabled');
    fast.classList.add('disabled');
    live.style.background = 'green';

}

function enableButtons() {
    generateNewArray.classList.remove('disabled');
    sort.classList.remove('disabled');
    select.classList.remove('disabled');
    smallArray.classList.remove('disabled');
    largeArray.classList.remove('disabled');
    slow.classList.remove('disabled');
    fast.classList.remove('disabled');
    live.style.background = '#FF0000';
}

//bubble sort
async function bubbleSort(arr, bars, delay) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            highlightadd(arr, bars, j); 
            
            if (arr[j] > arr[j + 1]) {
                await swap(arr, bars, j, delay); 
            }

            highlightremove(arr, bars, j); 
            await wait(delay); 
        }
    }
}


//insertion sort 
async function insertionSort(arr, bars, delay) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        highlightadd2(arr, bars, i); 

        while (j >= 0 && arr[j] > key) {
            highlightadd(arr, bars, j);
            await swap(arr, bars, j, delay);
            highlightremove(arr, bars, j);
            j--;
        }

        arr[j + 1] = key;
        updateUI(arr, bars, j + 1, i);
        highlightremove2(arr, bars, i); 
        await wait(delay);
    }
}


//selectionsort
async function selectionSort(arr, bars, delay) {
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        highlightadd2(arr, bars, i); 

        for (let j = i + 1; j < n; j++) {
            highlightadd2(arr, bars, j); 
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
            highlightremove2(arr, bars, j); 
        }

        if (minIndex !== i) {
            await swap2(arr, bars, i, minIndex, delay);
        }

        highlightremove2(arr, bars, i); 
        await wait(delay);
    }
}


//mergesort

async function mergeSort(arr, left, right, bars, delay) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);

        highlightadd2(arr, bars, mid); 
        await mergeSort(arr, left, mid, bars, delay);
        await mergeSort(arr, mid + 1, right, bars, delay);

        await merge(arr, left, mid, right, bars, delay);
        highlightremove2(arr, bars, mid); 
    }
}


async function merge(arr, left, mid, right, bars, delay) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        highlightadd2(arr, bars, i);
        highlightadd2(arr, bars, j);
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            updateUI(arr, bars, k, k); 
            highlightremove2(arr, bars, i);
            i++;
        } else {
            arr[k] = rightArray[j];
            updateUI(arr, bars, k, k); 
            highlightremove2(arr, bars, j);
            j++;
        }
        await wait(delay); 
        k++;
        highlightremove2(arr, bars, i);
        highlightremove2(arr, bars, j);
    }

    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        highlightadd2(arr, bars, i);
        updateUI(arr, bars, k, k); 
        await wait(delay); 
        highlightremove2(arr, bars, i);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        highlightadd2(arr, bars, j);
        updateUI(arr, bars, k, k); 
        await wait(delay); 
        highlightremove2(arr, bars, j);
        j++;
        k++;
    }
}

//quick sort
async function quickSort(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high); 
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    highlightadd2(arr, bars, high); 
    for (let j = low; j < high; j++) {
        highlightadd2(arr, bars, j); 
        if (arr[j] <= pivot) {
            i++;
            await swap2(arr, bars, i, j, speed);
        }
        highlightremove2(arr, bars, j); 
    }

    await swap2(arr, bars, i + 1, high, speed);
    highlightremove2(arr, bars, high); 
    return i + 1;
}

//heap sort
async function heapsort(arr, st, end, bars, speed)
{
    heapify(arr, st, end);
    for(let i=0;i<arr.length;i++)
    {
        highlightadd2(arr, bars, st);
        highlightadd2(arr, bars, end);
       await swap2(arr, bars, st, end, speed);
        highlightremove2(arr, bars, st);
        highlightremove2(arr, bars, end);
        end--;
        heapify(arr, st, end);
    }
}

async function heapify(arr, st, end)
{
    let i = end;
    while (i >= 0) {
        highlightadd2(arr, bars, i);
        let left = Number.MIN_VALUE;
        let right = Number.MIN_VALUE;

        if (2 * i + 1 <= end) {
            left = arr[2 * i + 1];
        }
        if (2 * i + 2 <= end) {
            right = arr[2 * i + 2];
        }

        if (Math.max(left, right) > arr[i]) {
            if (left > right) {
                highlightadd2(arr, bars, 2*i+1);
                swap2(arr, bars, i, 2 * i + 1, speed);
                highlightremove2(arr, bars, 2*i+1);
            } else {
                highlightadd2(arr, bars, 2*i+2);
                swap2(arr, bars, i, 2 * i + 2, speed);
                highlightremove2(arr, bars, 2*i+2);
            }
        }
        highlightremove2(arr, bars, i);
        i--;
    }
}



  async function swap(arr, bars, j, delay)
  {
    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; 
            updateUI(arr, bars, j, j+1); 
            await wait(delay); 
  }

  async function swap2(arr, bars, i, j, delay)
  {
    [arr[i], arr[j]] = [arr[j], arr[i]]; 
            updateUI(arr, bars, i, j); 
            await wait(delay); 
  }


  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function highlightadd(arr, bars, j)
  {
    bars[j].style.background = 'yellow';
    bars[j+1].style.background = 'yellow';
  }

  function highlightadd2(arr, bars, j)
  {
    bars[j].style.background = 'yellow';
  }

function highlightremove(arr, bars, j)
  {
    bars[j].style.background = '#DC143C';
    bars[j+1].style.background = '#DC143C';
  }
  function highlightremove2(arr, bars, j)
  {
    bars[j].style.background = '#DC143C';
  }

  
generate();
