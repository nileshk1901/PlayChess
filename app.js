// const express=require("express");
// const socket=require("socket.io");
// const http= require("http");
// const {Chess}=require("chess.js")
// const path=require("path");



// const app=express();

// const server=http.createServer(app);//linked http server with express
// const io=socket(server);//now socket will give you real time connectivity





// const chess=new Chess();
// let players={};
// let currentPlayer="w ";

// app.set("view engine","ejs");//by this we can use ejs which is verys similar to html
// app.use(express.static(path.join(__dirname,"public")));// we can use static files css vanilla javascript,images videios




// app.get("/",(req,res)=>{
//     res.render("index",{title:"Chess Game"});
// });
// //unique infromation
// io.on("connection",function(uniquesocket){
//     console.log("Connected");

//     if(!players.White){
//         players.white= uniquesocket.id;
//         uniquesocket.emit("playerRole","w");
//     }
//     else if(!players.black){
//         players.black=uniquesocket.id;
//         uniquesocket.emit("playerRole","b");
//     }else{
//         uniquesocket.emit("spectatorRole");
//     }
//     uniquesocket.emit("boardState", chess.fen());


//     uniquesocket.on("disconnect",function(){
//         if(uniquesocket.id===players.white){
//             delete players.white;
//         }else if(uniquesocket.id===players.black){
//             delete players.black;
//         }

//     });

//     uniquesocket.on("move", (move)=>{
//         try {
//             if(chess.turn()==='w'&& uniquesocket.id!==players.white)
//                 return;
//             if(chess.turn()==='b'&& uniquesocket.id!==players.black)
//                 return;
//             const result=chess.move(move);
//             if(result){
//                // currentPlayer=chess.turn();
//                 io.emit("move",move);
//                 io.emit("boardState",chess.fen())//send the current state of chess board
//             }
//             else{
//                 console.log("Invalid move :" ,move);
//                 uniquesocket.emit("Invalid Move",move);
//             }
//         } catch (error) {
//             console.log(error);
//             uniquesocket.emit("Invalid move:",move);
            
//         }
//     })
// });



// server.listen(3000,function(){
//     console.log("listeninng on port 3000 ")
// })
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

io.on("connection", function (uniquesocket) {
    console.log("Connected");

    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    // Send the current board state to the new connection
    uniquesocket.emit("boardState", chess.fen());

    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id === players.white) {
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    uniquesocket.on("move", (move) => {
        try {
            if (chess.turn() === 'w' && uniquesocket.id !== players.white) return;
            if (chess.turn() === 'b' && uniquesocket.id !== players.black) return;

            const result = chess.move(move);
            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move:", move);
                uniquesocket.emit("invalidMove", move);
            }
        } catch (error) {
            console.log(error);
            uniquesocket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, function () {
    console.log("Listening on port 3000");
});
