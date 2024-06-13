import datetime as dt
import csv



year = ['2022', '2023']
FIELD_NAME = ['date','time', 'code', 'tide']

def get_hightide(fieldname, year):
    with open('outputs/' + year + '_high.csv', mode='w') as csvfile:

        # fieldname = ['time', 'code', 'tide']
        writer = csv.DictWriter(csvfile, fieldname)
        writer.writeheader()

        for a in range(len(Date)):
            for b in range(len(HighTide[a])):
                writer.writerow({'date':Date[a].date(),'time':HighTideTime[a][b].strftime('%H:%M'), 'code':AreaCode[a], 'tide':HighTide[a][b]})

        
        csvfile.close()



def get_lowtide(fieldname, year):
    with open('outputs/' + year + '_low.csv', mode='w') as csvfile:

        # fieldname = ['time', 'code', 'tide']
        writer = csv.DictWriter(csvfile, fieldname)
        writer.writeheader()

        for a in range(len(Date)):
            for b in range(len(LowTide[a])):
                writer.writerow({'date':Date[a].date(), 'time':LowTideTime[a][b].strftime('%H:%M'), 'code':AreaCode[a], 'tide':LowTide[a][b]})

        
        csvfile.close()

def hourly(fieldname, year):
    with open('outputs/' + year + '_hourly.csv', mode='w') as csvfile:

        # fieldname = ['time', 'code', 'tide']

        writer = csv.DictWriter(csvfile, fieldname)
        writer.writeheader()

        for a in range(len(Date)):
            for b in range(24):
                writer.writerow({'date':Date[a].date(), 'time':Date[a].replace(hour=b).strftime('%H:%M'), 'code':AreaCode[a], 'tide':everytide[a][b]})



        csvfile.close()

for y in year:
    Date = []
    AreaCode = []
    HourTide = []
    LowTide = []
    LowTideTime = []
    HighTide = []
    HighTideTime = []
    HighTideTable = []
    everytide = []

    file = 'data/'+ y +'_N1_TideData.txt'
    with open(file, mode='r') as f:
        DataList = f.readlines()
        f.close()
        cnt = 0
        for i in DataList:

            date = dt.datetime(int('20' + i[72:74]), int(i[74:76]), int(i[76:78]))

            Date.append(date)

            # area code
            AreaCode.append(i[78:80])

            #HighTide
            hightime = []
            hightide = []

            if i[80:84] != '9999':
                hightime.append(date.replace(hour=int(i[80:82]), minute=int(i[82:84])))
                hightide.append(int(i[84:87]))
            if i[87:91] != '9999':
                hightime.append(date.replace(hour=int(i[87:89]), minute=int(i[89:91])))
                hightide.append(int(i[91:94]))
            if i[94:98] != '9999':
                hightime.append(date.replace(hour=int(i[94:96]), minute=int(i[96:98])))
                hightide.append(int(i[98:101]))
            if i[101:105] != '9999':
                hightime.append(date.replace(hour=int(i[101:103]), minute=int(i[103:105])))
                hightide.append(int(i[105:108]))


            HighTideTime.append(hightime)
            HighTide.append(hightide)

            #LowTide
            lowtime = []
            lowtide = []

            if i[108:112] != '9999':
                lowtime.append(date.replace(hour=int(i[108:110]), minute=int(i[110:112])))
                lowtide.append(int(i[112:115])) 
            if i[115:119] != '9999':
                lowtime.append(date.replace(hour=int(i[115:117]), minute=int(i[117:119])))
                lowtide.append(int(i[119:122])) 
            if i[122:126] != '9999':
                lowtime.append(date.replace(hour=int(i[122:124]), minute=int(i[124:126])))
                # lowtime.append(i[122:126])
                lowtide.append(int(i[126:129])) 
            if i[129:133] != '9999':
                # lowtime.append(i[129:133])
                lowtime.append(date.replace(hour=int(i[129:131]), minute=int(i[131:133])))
                lowtide.append(int(i[133:136])) 

            LowTideTime.append(lowtime)
            LowTide.append(lowtide)

            # everyhour tide
            everytide.append([int(i[0:72][x:x+3]) for x in range(0, len(i[0:72]), 3)])
            
            

            # print(Date[cnt].date())
            # print(AreaCode[cnt])
            # print(LowTide[cnt])
            # print(LowTideTime[cnt])
            # print(HighTide[cnt])
            # print(HighTideTime[cnt])
            # print(everytide[cnt])


            cnt+=1
    # Generate csv files
    get_lowtide(FIELD_NAME, y)
    get_hightide(FIELD_NAME, y)
    hourly(FIELD_NAME, y)





