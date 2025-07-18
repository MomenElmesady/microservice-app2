aa = []
for _ in range(int(input())):
  s = input()
  c = 1 
  p = s[0]
  for i in s : 
    if i == p :
      continue
    else :
      p = i
      c+=1 
  if s.count("01") > 0 :
    aa.append(c-1)
  else :
    aa.append(c)

for i in aa :
  print(i)