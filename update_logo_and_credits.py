import os
import glob

files_to_update = glob.glob('*.html')

navbar_logo_orig = '<h1 class="m-0"><img class="img-fluid me-3" src="images/schoolclub.png" alt="" style="width: 50px;">School Club</h1>'
navbar_logo_new = '<h1 class="m-0"><img class="img-fluid me-3" src="images/schoolclub.png" alt="" style="width: 50px;"><span style="color: #001064;">School</span><span style="color: #FF800F;">Club</span></h1>'

footer_logo_orig = '<h1 class="text-white mb-4"><img class="img-fluid me-3" src="images/schoolclub.png" alt="" style="width: 50px;">School Club</h1>'
footer_logo_new = '<a href="index.html" style="text-decoration: none;"><h1 class="mb-4"><img class="img-fluid me-3" src="images/schoolclub.png" alt="" style="width: 50px;"><span style="color: #001064;">School</span><span style="color: #FF800F;">Club</span></h1></a>'

credit_orig = 'Designed By <a href="#">Helyonex</a>'
credit_new = 'Designed By <a href="https://helyonex.com">Helyonex</a>'

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if navbar_logo_orig in content:
        content = content.replace(navbar_logo_orig, navbar_logo_new)
        
    if footer_logo_orig in content:
        content = content.replace(footer_logo_orig, footer_logo_new)
        
    if credit_orig in content:
        content = content.replace(credit_orig, credit_new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {filepath}")
