var currentServer=1;
var columns=3;
var nodeNames = {
  1: {
    name : "c1.tankionline.com",
    maxUsers : 1300
  },
  2: {
    name : "c2.tankionline.com",
    maxUsers : 1700
  },
  3: {
    name : "c3.tankionline.com",
    maxUsers : 1700
  },
  4: {
    name : "c4.tankionline.com",
    maxUsers : 1700
  },
  5: {
    name : "c5.tankionline.com",
    maxUsers : 1400
  },
  6: {
    name : "c6.tankionline.com",
    maxUsers : 1700
  },
  7: {
    name : "c7.tankionline.com",
    maxUsers : 1700
  },
  8: {
    name : "c8.tankionline.com",
    maxUsers : 1800
  },
  9: {
    name : "c9.tankionline.com",
    maxUsers : 1800
  },
  10: {
    name : "c10.tankionline.com",
    maxUsers : 1800
  },
  11: {
    name : "c11.tankionline.com",
    maxUsers : 1800
  },
  12: {
    name : "c12.tankionline.com",
    maxUsers : 1800
  },
  13: {
    name : "c13.tankionline.com",
    maxUsers : 1800
  },
  14: {
    name : "c14.tankionline.com",
    maxUsers : 1800
  },
  15: {
    name : "c15.tankionline.com",
    maxUsers : 1700
  },
  16: {
    name : "c16.tankionline.com",
    maxUsers : 1400
  },
  17: {
    name : "c17.tankionline.com",
    maxUsers : 1400
  },
  18: {
    name : "c18.tankionline.com",
    maxUsers : 1400
  },
  19: {
    name : "c19.tankionline.com",
    maxUsers : 1800
  },
  20: {
    name : "c20.tankionline.com",
    maxUsers : 1800
  },
  21: {
    name : "c21.tankionline.com",
    maxUsers : 1800
  },
  22: {
    name : "c22.tankionline.com",
    maxUsers : 1800
  },
  23: {
    name : "c23.tankionline.com",
    maxUsers : 1800
  },
  24: {
    name : "c24.tankionline.com",
    maxUsers : 1800
  },
  25: {
    name : "c25.tankionline.com",
    maxUsers : 1800
  },
  26: {
    name : "c26.tankionline.com",
    maxUsers : 2500
  }
};

$(document).ready(function(){
  var hash = document.location.hash;
  if (hash.length > 0) {
    $("a").each( function() {
      if (this.href.indexOf('http://' + document.location.host) == 0) {
        this.href += hash;
      }
    });
  }
  initServers();
  setInterval(function(){
    $.get("/s/status.js?rnd=" + Math.random(), function(data){
      eval("stat=" + data);
      update();
    })
  }, 30000);
});


function initServers() {
  var tds=new Array();
  $("#serversList").html('');
  for (var i in nodeNames) {
    var td=$('<td><a class="part" id="server-'+i+'"><span>'+i+'</span><ul></ul><span class="players"></span></a>');
    $("a",td).click( function() {
      if (!$(this).hasClass("disabled")) {
        $("#serversList").fadeOut('fast');
        setServer($(this).attr('id').replace("server-", ""));
      }
      return false;
    });
    tds.push(td);
  }
  var rows=Math.ceil(tds.length/columns);
  for (var i=0; i<rows;i++) {
    var inrow="";
    var tr=$('<tr>');
    for (var j=0;j<columns;j++) {
      var pos=(rows*j+i);
      if (pos<tds.length)
        tr.append(tds[pos]);
    }
    $("#serversList").append(tr);
  }
  setServer(selectProperServer());
  update();
}

function showServerList(button) {
  if ($('#serversList').is(":visible")) {
    $('#serversList').fadeOut('fast');
  } else {
    var right=$(button).offset().left+$(button).width();
    var left=right-$('#serversList').width();
    $('#serversList').css('left', left);
    $('#serversList').fadeIn('fast');
  }
}
function setServer(id) {
  if (id) {
    currentServer = id;
    $("#startButton").attr('href', $("#startButton").attr('href').replace(/\d+(\.html)/, id + "$1"));
    updateServer(id);
  }
}
function selectProperServer() {
  var minFill = 2;
  var server;
  for (var i in nodeNames) {
    if (stat.nodes[nodeNames[i].name]) {
      var online = parseInt(stat.nodes[nodeNames[i].name].inbattles);
      var fill=online/nodeNames[i].maxUsers;
      if (fill < minFill) {
        minFill = fill;
        server = i;
        if (fill<=(2/3))
          break;
      }
    }
  }
  return server;
}
function format(s) {
  s = new String(s);
  s = s.replace(/(?=([0-9]{3})+$)/g, " ");
  return s;
}
function getServerLoad(i) {
  var st = stat.nodes[nodeNames[i].name];
  if (st) {
    return parseInt(st.inbattles / nodeNames[i].maxUsers * 4);
  } else {
    return 1000;
  }
}
function updateServer(i) {
  var st = stat.nodes[nodeNames[i].name];
  var load=getServerLoad(i);
  var text;
  var bars = "";
  for (var j = 1; j <= 4; j++) {
    var bar;
    if (load>=4) {
      bar=barOff;
    } else if(j<=load) {
      bar=barOver;
    } else {
      bar=barNormal;
    }
    bars += '<li><img src="' + bar + '" alt="" /></li>';
  }

  var selectors=["#server-" + i];
  if (i == currentServer) {
    $("#currentServer span").html(i);
    selectors.push("#currentServer");
  }
  $(selectors).each(function(){
    $(this + " ul").html(bars);
    $(this + " .players").html(formatUsers(st));
    if (load >= 4) {
      $(String(this)).addClass("disabled");
    }
    else {
      $(String(this)).removeClass("disabled");
    }
  });
  return load<4;
}

function formatUsers(st) {
  var ret = "";
  switch (lang) {
    case "en":
      if (st) {
        ret += st.online;
        ret += " player";
        if (st.online != 1)
          ret += "s";
      } else {
        ret = "Offline";
      }
      break;
    case "ru":
      if (st) {
        var endings = [ "מג", "א" ];
        var countString = new String("0" + st.online);
        ret += st.online;
        ret += " טדנמך";
        if (countString.substr(-2, 1) == 1) {
          ret += endings[0];
        } else {
          var lastNum = countString.substr(-1, 1);
          if (lastNum == 1) {
          } else if (lastNum >= 2 && lastNum <= 4) {
            ret += endings[1];
          } else {
            ret += endings[0];
          }
        }
      } else {
        ret = "Offline";
      }
      break;
    case "cn":
      if (st) {
        ret += st.online + "???";
      } else {
        ret += "?????...";
      }
  }
  return ret;
}

function update(){
  $("#statTotal").html(format(stat.total));
  var online = 0;
  var inbattles = 0;
  var available = false;
  var currentOk = true;
  for (var i in nodeNames) {
    var av=updateServer(i);
    available |= av;

    if (!av&&i==currentServer) {
      currentOk=false;
    }

    var st = stat.nodes[nodeNames[i].name];
    if (st) {
      inbattles += st.inbattles;
      online += st.online;
    }
  }
  $("#statOnline").html(format(online));
  $("#statInBattles").html(format(inbattles));

  if (available == $("#startButton").is(':hidden')) {
    $("#startButton").toggle();
    $(".server .btn-not").toggle();
  }

  if (available && !currentOk) {
    setServer(selectProperServer());
  }
}
