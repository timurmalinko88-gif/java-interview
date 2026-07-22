import os
import glob
import re

files = glob.glob('src/*.js')

# We want to replace logic opening/closing dialogs.
# Specifically:
# document.getElementById('mock-setup-modal').classList.remove('hidden') -> document.getElementById('mock-setup-modal').showModal()
# document.getElementById('mock-setup-modal').classList.add('hidden') -> document.getElementById('mock-setup-modal').close()
# And similar for other modals: mock-results-modal, adaptive-modal, adaptive-roadmap-modal (or roadmap-modal), adaptive-success-modal (or success-modal), stats-dashboard-modal (or stats-modal)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find: (something).classList.remove('hidden')
    # Since some are variables like successModal.classList.remove('hidden')
    # We will replace them manually where appropriate.

    content = re.sub(r"(document\.getElementById\('mock-setup-modal'\))\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(document\.getElementById\('mock-setup-modal'\))\.classList\.add\('hidden'\)", r"\1.close()", content)

    content = re.sub(r"(document\.getElementById\('mock-results-modal'\))\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(document\.getElementById\('mock-results-modal'\))\.classList\.add\('hidden'\)", r"\1.close()", content)

    content = re.sub(r"(successModal)\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(successModal)\.classList\.add\('hidden'\)", r"\1.close()", content)

    content = re.sub(r"(modal)\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(modal)\.classList\.add\('hidden'\)", r"\1.close()", content)

    content = re.sub(r"(roadmapModal)\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(roadmapModal)\.classList\.add\('hidden'\)", r"\1.close()", content)

    content = re.sub(r"(statsModal)\.classList\.remove\('hidden'\)", r"\1.showModal()", content)
    content = re.sub(r"(statsModal)\.classList\.add\('hidden'\)", r"\1.close()", content)
    
    # We shouldn't replace `.classList.remove('hidden')` indiscriminately because it's used for other non-modal things (like answerSection, mock-status-bar, etc).
    # Only modals were changed to <dialog>!

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Dialogs fixed.")
