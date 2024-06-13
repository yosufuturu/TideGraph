import csv

file = 'data.txt'

dlf = [
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    2, 2, 2, 2, 
    4, 3, 4, 3, 4, 3, 4, 3,
    4, 3, 4, 3, 4, 3, 4, 3]

with open(file, mode='r') as f:
    dataList = f.readlines()
    f.close()
    
    #clum title
    print(['  0', '  1', '  2', '  3', '  4', '  5', '  6', '  7', '  8', '  9', ' 10', ' 11',
            ' 12', ' 13', ' 14', ' 15', ' 16', ' 17', ' 18', ' 19', ' 20', ' 21', ' 22', ' 23',
            '年', '月', '日', 'cd', '時刻', ' 位', '時刻', ' 位'
        ])

    outData = []

    for i in dataList:
        l = []
        st = 0
        ed = dlf[0]
        for t in range(len(dlf)):

            l.append(int(i[st:ed].replace(' ',''))) if t < 24 else l.append(i[st:ed])

            st += dlf[t]
            ed += dlf[t]
            
            if t ==23:ed -=1 
            if t ==27:ed +=2 
            if t ==28:ed -=1

            if t >= 29:
                if t%2!=0:
                    ed +=1
                else:
                    ed -=1

        print(l, len(l))
        outData.append(l)



with open('parseData.csv', mode='w', newline='') as of:
    writer = csv.writer(of)
    writer.writerows(outData)
    of.close()




    