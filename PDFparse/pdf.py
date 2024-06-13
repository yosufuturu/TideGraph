from PyPDF2 import PdfReader
import re
import csv

file = 'data/marine_00.pdf'

rd = PdfReader(file)


def getTideData(page):

    ret = []

    for i in range(12):
        data = excludeUnnecessaryData(page.pages[i])
        for line in data[1:]:
            
            monthly = []
            shortage = []

            for line in data[2:]:
                clean = []

                # //行毎に処理
                for col in line.split(" "):


                    # //日付が含まれるものを分割
                    splitDates = re.split("(.潮)|(\*?\d{2}:\d{2})", col)

                    # //空の要素を削除
                    deleteEmpties = filter(None, splitDates)

                    # //リストに変換
                    clean.append(list(deleteEmpties))

                # 1次元配列に変換
                flat = sum(clean, [])

                monthly.append(flat[:26]) if len(flat) > 25 else shortage.append(flat)
                
        if 0 < len(shortage):
            for x in range(0, len(shortage), 2):
                monthly.append(shortage[x] + shortage[x+1])

        for x in monthly:
            x[0] = f'2023-{i+1:02}-{int(x[0]):02}'

        monthly.sort()
        [ret.append(x) for x in monthly]

    return ret


def excludeUnnecessaryData(pdf):
    text = pdf.extract_text().replace('\u3000', ' ').replace('\n潮', '潮').replace('\n閏', '閏').replace('＊', ' *').replace('\n＊', ' *').split('\n')

    data = []
    parts = []
    flag = False

    for i in text:
        if bool(re.search(r'※ご使用について', i)) :
            data.append(' '.join(parts))
            break
        if bool(re.search(r'関門|関 門|満潮|cm|掲載', i)) : continue

        flag = True if re.search(r'^\d+', i) is None else False

        if flag:
            parts.append(i)
        else :
            data.append(' '.join(parts))
            parts = [i]

    return data

def formatTable(data):

    pattern = r'^(?!--)' #(?!\*)
    west_commutation = []
    east_commutation = []
    lowtide = []
    hightide = []
    tideName = []
    sunTime = []
    fail = []
    for e in data:
        try:
            # west
            if bool(re.search(pattern, e[6])): west_commutation.append([e[0], e[6], e[7], e[8]])
            if bool(re.search(pattern, e[19])): west_commutation.append([e[0], e[19], e[20], e[21]])

            #east
            if bool(re.search(pattern, e[9])): east_commutation.append([e[0], e[9], e[10], e[11]])
            if bool(re.search(pattern, e[22])): east_commutation.append([e[0], e[22], e[23], e[24]])
            
            # tide name
            tideName.append([e[0], e[1]])

            # low tide
            if bool(re.search(pattern, e[4])): lowtide.append([e[0], e[4], e[5]])
            if bool(re.search(pattern, e[17])): lowtide.append([e[0], e[17], e[18]])

            # high tide
            if bool(re.search(pattern, e[2])): hightide.append([e[0], e[2], e[3]])
            if bool(re.search(pattern, e[15])): hightide.append([e[0], e[15], e[16]])


            #sun
            sunTime.append([e[0], e[12], e[25]])
        
        except Exception as err:
            fail.append([e, err])
            print(err)
            continue


    return {'west':west_commutation, 'east':east_commutation, 'tide':tideName, 'suntime':sunTime, 'lowtide':lowtide, 'hightide':hightide, 'fail':fail}

def generateCommutation(data, direction):
        
        with open(f'outputs_kaiho/{direction}.csv' , mode='w') as f:
        
            FIELD_NAME = ['date','commutation_time', 'fastest_time', 'speed']
        
            writer = csv.writer(f)
            writer.writerow(FIELD_NAME)

            for x in data:
                writer.writerow(x)

            f.close()


def generateTideName(data):
    with open('outputs_kaiho/tide_name.csv' , mode='w') as f:
        
            FIELD_NAME = ['date','tide_name']
        
            writer = csv.writer(f)
            writer.writerow(FIELD_NAME)

            for x in data:
                writer.writerow(x)

            f.close()

def generateSunTime(data):
        with open('outputs_kaiho/sunTime.csv' , mode='w') as f:
        
            FIELD_NAME = ['date','sunRise','sunSet']
        
            writer = csv.writer(f)
            writer.writerow(FIELD_NAME)

            for x in data:
                writer.writerow(x)

            f.close()

def generateLowTide(data):
    with open('outputs_kaiho/LowTide.csv' , mode='w') as f:
    
        FIELD_NAME = ['date','time','tide']
    
        writer = csv.writer(f)
        writer.writerow(FIELD_NAME)

        for x in data:
            writer.writerow(x)

        f.close()

def generateHighTide(data):
    with open('outputs_kaiho/HighTide.csv' , mode='w') as f:

        FIELD_NAME = ['date','time','tide']

        writer = csv.writer(f)
        writer.writerow(FIELD_NAME)

        for x in data:
            writer.writerow(x)

        f.close()

def generateCSV(data):

    generateCommutation(data['east'], 'east')
    generateCommutation(data['west'], 'west')
    generateTideName(data['tide'])
    generateSunTime(data['suntime'])
    generateLowTide(data['lowtide'])
    generateHighTide(data['hightide'])


params = getTideData(rd)

result = formatTable(params)

generateCSV(result)

# end of file
