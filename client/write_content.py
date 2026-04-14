import json

content = {
  "Cell Biology": {
    "notes": {
      "body": "The cell is the basic structural and functional unit of all living organisms. Robert Hooke first observed cells in 1665 using a microscope. All cells come from pre-existing cells (cell theory). There are two main types: prokaryotic cells (no nucleus, e.g. bacteria) and eukaryotic cells (have a nucleus, e.g. plant and animal cells).",
      "sections": [
        {"title": "Animal Cell Structure", "color": "blue", "items": ["Cell membrane - controls entry and exit of substances", "Nucleus - contains DNA, controls cell activities", "Cytoplasm - jelly-like fluid where reactions occur", "Mitochondria - produces energy (ATP) through respiration", "Ribosomes - site of protein synthesis", "Endoplasmic reticulum - transports materials"]},
        {"title": "Plant Cell Structure", "color": "green", "items": ["All animal cell parts PLUS:", "Cell wall (cellulose) - gives shape and support", "Chloroplasts - contain chlorophyll for photosynthesis", "Large central vacuole - stores water and maintains turgor", "Tonoplast - membrane surrounding the vacuole"]},
        {"title": "Key Differences", "color": "orange", "items": ["Plant cells have cell wall; animal cells do not", "Plant cells have chloroplasts; animal cells do not", "Plant cells have large vacuole; animal cells have small vacuoles", "Plant cells have regular shape; animal cells are irregular"]},
        {"title": "Cell Functions", "color": "purple", "items": ["Diffusion - movement of substances from high to low concentration", "Osmosis - movement of water through semi-permeable membrane", "Active transport - movement against concentration gradient (needs energy)", "Cell division - mitosis (growth) and meiosis (reproduction)"]}
      ],
      "definition": "A cell is the smallest unit of life that can carry out all basic life processes including nutrition, respiration, excretion, growth, and reproduction.",
      "formula": "Cell Theory: All living things are made of cells | Cells come from pre-existing cells | The cell is the basic unit of life",
      "example": "When you cut your finger, your body produces new cells through mitosis to heal the wound. Each new cell is identical to the original and contains the same DNA.",
      "summary": "Cells are the building blocks of life. Understanding cell structure helps explain how organisms grow, reproduce, and respond to their environment."
    },
    "qa": [
      {"q": "What is a cell?", "a": "A cell is the basic structural and functional unit of all living organisms. It is the smallest unit that can carry out all life processes."},
      {"q": "Who first discovered cells?", "a": "Robert Hooke first observed and named cells in 1665 when he looked at cork under a microscope and saw small box-like structures."},
      {"q": "What is the cell membrane?", "a": "The cell membrane is a thin, flexible layer that surrounds all cells. It controls what enters and leaves the cell and is described as selectively permeable."},
      {"q": "What is the function of the nucleus?", "a": "The nucleus is the control centre of the cell. It contains DNA (genetic information) and controls all cell activities including growth, metabolism, and reproduction."},
      {"q": "What is the difference between plant and animal cells?", "a": "Plant cells have a cell wall, chloroplasts, and a large central vacuole which animal cells do not have. Both types have a nucleus, cell membrane, cytoplasm, and mitochondria."},
      {"q": "What is the function of mitochondria?", "a": "Mitochondria are the powerhouse of the cell. They produce energy in the form of ATP through the process of cellular respiration using glucose and oxygen."},
      {"q": "What is chlorophyll and where is it found?", "a": "Chlorophyll is the green pigment found in chloroplasts of plant cells. It absorbs sunlight energy used in photosynthesis to make food (glucose) from carbon dioxide and water."},
      {"q": "What is diffusion?", "a": "Diffusion is the movement of molecules from an area of high concentration to an area of low concentration. It does not require energy and continues until equilibrium is reached."},
      {"q": "What is osmosis?", "a": "Osmosis is the movement of water molecules from a region of high water concentration (dilute solution) to a region of low water concentration (concentrated solution) through a semi-permeable membrane."},
      {"q": "What is active transport?", "a": "Active transport is the movement of substances against the concentration gradient (from low to high concentration). It requires energy (ATP) from the mitochondria."},
      {"q": "What is the cell wall made of?", "a": "The cell wall of plant cells is made of cellulose, a complex carbohydrate. It provides structural support and protection, and gives the plant cell its regular shape."},
      {"q": "What is the vacuole?", "a": "A vacuole is a membrane-bound sac in the cytoplasm. Plant cells have a large central vacuole filled with cell sap that helps maintain the shape of the cell through turgor pressure."},
      {"q": "What is mitosis?", "a": "Mitosis is a type of cell division that produces two identical daughter cells with the same number of chromosomes as the parent cell. It is used for growth and repair."},
      {"q": "What is meiosis?", "a": "Meiosis is a type of cell division that produces four daughter cells, each with half the number of chromosomes of the parent cell. It is used to produce sex cells (gametes)."},
      {"q": "What are ribosomes?", "a": "Ribosomes are tiny organelles found in the cytoplasm and on the endoplasmic reticulum. They are the site of protein synthesis, where amino acids are joined together to make proteins."},
      {"q": "What is the endoplasmic reticulum?", "a": "The endoplasmic reticulum (ER) is a network of membranes in the cytoplasm. Rough ER has ribosomes and makes proteins; smooth ER makes lipids and detoxifies chemicals."},
      {"q": "What is a prokaryotic cell?", "a": "A prokaryotic cell is a simple cell with no membrane-bound nucleus. The DNA floats freely in the cytoplasm. Bacteria are examples of prokaryotic organisms."},
      {"q": "What is a eukaryotic cell?", "a": "A eukaryotic cell has a true nucleus enclosed by a nuclear membrane. Plant cells, animal cells, and fungal cells are all eukaryotic."},
      {"q": "How does the cell membrane control what enters the cell?", "a": "The cell membrane is selectively permeable, meaning it allows some substances to pass through (like oxygen and glucose) while blocking others. Small molecules pass through more easily than large ones."},
      {"q": "What is turgor pressure?", "a": "Turgor pressure is the pressure exerted by water inside a plant cell against the cell wall. When a plant cell is full of water it is turgid and firm, which helps support the plant."},
      {"q": "What happens when a plant cell loses water?", "a": "When a plant cell loses water, it becomes flaccid (soft). If it loses too much water, the cell membrane pulls away from the cell wall in a process called plasmolysis."},
      {"q": "What is the function of the cytoplasm?", "a": "The cytoplasm is the jelly-like fluid that fills the cell. It holds all the organelles in place and is the site of many chemical reactions including glycolysis."},
      {"q": "Why are cells small?", "a": "Cells are small to maintain a large surface area to volume ratio. This allows efficient exchange of materials (oxygen, nutrients, waste) between the cell and its environment."},
      {"q": "What is the nuclear membrane?", "a": "The nuclear membrane (nuclear envelope) is a double membrane that surrounds the nucleus. It has pores that allow substances like RNA to pass between the nucleus and cytoplasm."},
      {"q": "How do cells get energy?", "a": "Cells get energy through cellular respiration. Glucose and oxygen react in the mitochondria to produce ATP (energy), carbon dioxide, and water. The equation is: C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP"}
    ],
    "quiz": [
      {"q": "What is the basic unit of life?", "options": ["Atom", "Cell", "Tissue", "Organ"], "answer": 1},
      {"q": "Which organelle is called the powerhouse of the cell?", "options": ["Nucleus", "Vacuole", "Mitochondria", "Ribosome"], "answer": 2},
      {"q": "Which structure controls what enters and leaves the cell?", "options": ["Cell wall", "Cell membrane", "Nucleus", "Vacuole"], "answer": 1},
      {"q": "Where does photosynthesis take place?", "options": ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"], "answer": 2},
      {"q": "Which structure is found in plant cells but NOT animal cells?", "options": ["Nucleus", "Cell membrane", "Cell wall", "Mitochondria"], "answer": 2},
      {"q": "What is the cell wall of plant cells made of?", "options": ["Protein", "Starch", "Cellulose", "Lipid"], "answer": 2},
      {"q": "What does the nucleus contain?", "options": ["ATP", "Chlorophyll", "DNA", "Glucose"], "answer": 2},
      {"q": "What is osmosis?", "options": ["Movement of glucose", "Movement of water through semi-permeable membrane", "Movement of oxygen", "Movement of minerals"], "answer": 1},
      {"q": "Which type of cell division produces sex cells?", "options": ["Mitosis", "Meiosis", "Binary fission", "Budding"], "answer": 1},
      {"q": "What is the function of ribosomes?", "options": ["Energy production", "Protein synthesis", "Photosynthesis", "Cell division"], "answer": 1},
      {"q": "What is active transport?", "options": ["Movement with concentration gradient", "Movement against concentration gradient using energy", "Movement of water only", "Random movement of molecules"], "answer": 1},
      {"q": "A cell that has lost too much water is described as:", "options": ["Turgid", "Plasmolysed", "Flaccid", "Both B and C"], "answer": 3},
      {"q": "Which scientist first observed cells?", "options": ["Darwin", "Pasteur", "Robert Hooke", "Mendel"], "answer": 2},
      {"q": "Prokaryotic cells differ from eukaryotic cells because they:", "options": ["Have no cell membrane", "Have no nucleus", "Have no cytoplasm", "Have no ribosomes"], "answer": 1},
      {"q": "What is the large central vacuole in plant cells filled with?", "options": ["Air", "Oil", "Cell sap", "Blood"], "answer": 2},
      {"q": "Which process does NOT require energy?", "options": ["Active transport", "Muscle contraction", "Diffusion", "Protein synthesis"], "answer": 2},
      {"q": "What is turgor pressure?", "options": ["Pressure from the nucleus", "Pressure of water against cell wall", "Pressure from mitochondria", "Pressure from cell membrane"], "answer": 1},
      {"q": "The endoplasmic reticulum is involved in:", "options": ["Energy production", "Photosynthesis", "Transport of materials in the cell", "Cell division"], "answer": 2},
      {"q": "How many daughter cells does mitosis produce?", "options": ["1", "2", "4", "8"], "answer": 1},
      {"q": "How many daughter cells does meiosis produce?", "options": ["1", "2", "4", "8"], "answer": 2},
      {"q": "What is the surface area to volume ratio important for?", "options": ["Cell colour", "Efficient exchange of materials", "Cell shape", "DNA replication"], "answer": 1},
      {"q": "Which organelle contains chlorophyll?", "options": ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"], "answer": 2},
      {"q": "What is the nuclear membrane also called?", "options": ["Nuclear wall", "Nuclear envelope", "Nuclear skin", "Nuclear coat"], "answer": 1},
      {"q": "Cellular respiration produces:", "options": ["Glucose and oxygen", "ATP, carbon dioxide and water", "Chlorophyll and starch", "Protein and fat"], "answer": 1},
      {"q": "Which of these is NOT a function of the cell membrane?", "options": ["Controls entry of substances", "Provides structural support like a wall", "Allows communication between cells", "Selectively permeable"], "answer": 1}
    ]
  }
}

output = 'export const REAL_CONTENT = ' + json.dumps(content, indent=2) + ';\n'
with open('src/data/realContent.js', 'w', encoding='utf-8') as f:
    f.write(output)
print('Written realContent.js with Cell Biology content')
