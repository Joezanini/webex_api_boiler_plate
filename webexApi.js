
const token = 'YjZmMzM5NWItMWFiMy00MGYyLThmZjctNDM4YTRhZTU3YzQyNGYxYzc4MjAtN2E4_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f';
//console.log(token);
document.getElementById('getRooms').addEventListener('click', listRooms);
document.getElementById('createRoom').addEventListener('click', createRoom);
document.getElementById('roomDetails').addEventListener('click', getRoomDetails);
document.getElementById('deleteRoom').addEventListener('click', deleteRoom);

/*
Function Name: listrooms
Description: The title of the room for 1:1 rooms will be
             display name of the other person. By default, 
             lists rooms to which the authenticated user belongs.
             Long result sets will be split into pages. 
             The API return object is sorted in order of roomId.
*/
function listRooms(){
    //change calls
    fetch('https://webexapis.com/v1/rooms', {
        method: 'GET', 
        headers : {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        //console.log(data);

        /*
        output of JSON object in a targeted HTML element
        comment out below to use above console logging functionality
        */
        let output = '';

        for(let i=0;i<data.items.length;i++){
            //console.log(String(data.items[i].id));
            output+=`
            <ul>
                <li>${data.items[i].created}</li>
                <li>${data.items[i].title}</li>
            </ul>
            `;
        }
        
        document.getElementById('output').innerHTML = output;
    })
}

/*
Function Name: getRoomId
Description: gets the room id of a specific room in order to use it 
             throughout the application.
Parameters : rName : The name of the room the id belongs to.
*/

function getRoomId(rName) {
    console.log(rName.length);
    console.log('trying to figure out whu this is not working');
    let rId = fetch('https://webexapis.com/v1/rooms', {
        method: 'GET', 
        headers : {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function(res){
        //console.log(res.json());
        return res.json();
    })
    .then(function(data){
        console.log(typeof(rName));
        console.log('in function ' + rName);
        //console.log(data.items.find(obj => obj.title == rName));
        console.log('rName : ' + rName);
        for(let i=0;i<data.items.length;i++){
            //console.log(rName);
            //console.log(data.items[i].title.length)
            if (data.items[i].title.replace(/\s+/g, "") == rName.replace(/\s+/g, "")) {
                console.log('found');
                return data.items[i].id;
            }
        }
        
        /*
        console.log(obj);
        console.log(typeof(obj));
        return obj.id;
        */
    })

    //console.log('this is the rId : ' + rId);
    return rId;
}

async function deleteRoom() {
    let rName = String(document.getElementById('delRoom').value);
    console.log(rName);
    let val = await getRoomId(rName);
    console.log('this is the val : ' + val);

    fetch('https://webexapis.com/v1/rooms/' + val, { 
        method: 'DELETE',
        headers : {
            'content-type': 'application/json',
         'Authorization': `Bearer ${token}`
        }
     })
    .then(() => console.log('Delete Successful'));

}

/*
Function Name: createRoom()
Description: Creates a room. The authenticated user is automatically
             added as a member of the room. The response is jsonified
             and logged in the console. if the 'get rooms' button is 
             clicked, a new list with new room populated on list will
             be generated upon successfull authentication and 200 
             response.
To do's: add a text field for entering custom room names and 
         authentication key values
*/

function createRoom() {
    let name = String(document.getElementById('rName').value);
    //console.log(name);
    let _data = {
        title: name,
      }
    //change calls
    fetch('https://webexapis.com/v1/rooms', {
        method: "POST",
        body: JSON.stringify(_data),
        headers : {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json()) 
    .then(json => console.log(json)); 
}

/*
Function Name: getRoomDetails
Description: Shows details of a room by ID.
*/

function getRoomDetails() {
    let identity = String(document.getElementById('rId').value);
    fetch('https://webexapis.com/v1/rooms/' + identity, {
        method: 'GET', 
        headers : {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        let output = '';

        output+=`
            <ul>
                <li>${data.title}</li>
                <li>${data.type}</li>
                <li>${data.created}</li>
            </ul>
            `;
        document.getElementById('outputrd').innerHTML = output;
        getMeetingDetails(identity);
    })
}

/*
Function Name: getMeetingDetails
Description: Shows meeting details of a room by ID.
*/

function getMeetingDetails(identity) {
    fetch('https://webexapis.com/v1/rooms/' + identity + '/meetingInfo', {
        method: 'GET', 
        headers : {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        let output = '';

        output+=`
            <ul>
                <li>${data.meetingLink}</li>
                <li>${data.meetingNumber}</li>
            </ul>
            `;
        document.getElementById('outputmd').innerHTML = output;
    })
}
