import pymongo
from pymongo import MongoClient

from pathlib import Path
import json
# userdict = { "000TT":1, "011TT":1, "022TT":1, "1":1, "000ha":1,"011me":1,"020yo":1,"030xi":1,"041le":1,"051zh":1,"061to":1,"071ki":1,"082mi":1,"092yu":1,"101re":1,"112jo":1,"120mu":1,"132qi":1,"142do":1,"152ze":1,"160ta":1,"171li":1,"181wu":1,"192ja":1,"202zh":1,"211fu":1,"222ke":1,"232yi":1,"241st":1,"252we":1,"260zr":1,"270xi":1,"280yi":1, "290re":1 }
userlist = [[0,"000ha"],[1,"011me"],[0,"020yo"],[0,"030xi"],[1,"041le"],[1,"051zh"],[1,"061to"],[1,"071ki"],[2,"082mi"],[2,"092yu"],[1,"101re"],[2,"112jo"],[0,"120mu"],[2,"132qi"],[2,"142do"],[2,"152ze"],[0,"160ta"],[1,"171li"],[1,"181wu"],[2,"192ja"],[2,"202zh"],[1,"211fu"],[2,"222ke"],[2,"232yi"],[1,"241st"],[2,"252we"],[0,"260zr"],[0,"270xi"],[0,"280yi"],[0,"290re"]]

def getMouseTrackSequence(uid):
    userid = "ipt_" + uid
    if Path("./cache/" + userid).exists():
        with open("./cache/" + userid, "r") as f:
            return json.load(f)
    client = MongoClient("127.0.0.1", 27017)
    db = client.vis_exercise
    collection = db["experiment"]
    cursor = list(collection.aggregate(
            [
            {"$match": {"userid": userid}},
            {"$group": {
                    "_id":"$userid",
                    "data":{
                        "$push":{
                            "time":"$d_timestamp",
                            "x":"$pageX",
                            "y":"$pageY",
                            "clientX": "$clientX",
                            "clientY": "$clientY",
                            "type":"$type"
                        }
                    },
                }
            },
            { "$sort": { "data.time": -1 } },
            ]))
    return cursor

for item in userlist:
    d = getMouseTrackSequence(item[1])
    if len(d) > 0:
        with open("cache/"+item[1]+".json", "w+") as f:
            json.dump(d[0],f)
        # print(item, len(d[0]["data"]))
# [1, '011me'] 2200
# [0, '020yo'] 3000
# [0, '030xi'] 1000
# [1, '071ki'] 1800
# [1, '101re'] 400
# [2, '112jo'] 600
# [0, '120mu'] 6400
# [1, '171li'] 6400
# [2, '192ja'] 3400
# [2, '202zh'] 1400
# [1, '211fu'] 6000
# [1, '241st'] 4400
# [2, '252we'] 9000
# [0, '270xi'] 1600
# [0, '290re'] 1600