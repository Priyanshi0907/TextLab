"""
Generates rich, comprehensive, diverse labeled datasets for all 5 TextLab tasks:
  1. Topic Classification (Technology, Sports, Health, Finance, Politics, Entertainment, Education)
  2. Sentiment Classification (Positive, Neutral, Negative)
  3. Spam Detection (Spam, Not Spam)
  4. Intent Classification (Complaint, Inquiry, Order Tracking, Refund, Cancellation, Technical Support, Feedback)
  5. Emotion Classification (Joy, Sadness, Anger, Fear, Surprise, Love, Neutral)
"""
import csv
import os
import random

random.seed(42)
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ==============================================================================
# 1. TOPIC CLASSIFICATION
# ==============================================================================
topics_data = {
    "Technology": [
        "Apple unveiled its latest iPhone with a breakthrough neural engine processor chip.",
        "Google announced major updates to its Gemini artificial intelligence models and cloud computing suite.",
        "Microsoft integrated OpenAI machine learning tools into its Windows operating system and developer stack.",
        "Nvidia reported record demand for enterprise AI GPU accelerators and high performance server clusters.",
        "Engineers are developing autonomous robotics and computer vision systems for smart manufacturing.",
        "The open-source community released a fast lightweight web framework for Python and JavaScript developers.",
        "Cybersecurity analysts detected a zero-day vulnerability in popular database encryption software.",
        "Tesla updated its full self-driving neural network with end-to-end deep learning algorithms.",
        "Quantum computing researchers demonstrated quantum advantage in complex cryptographic calculations.",
        "Companies are developing AMAZING AI products with deep neural networks and transformer architectures.",
        "The new smartphone features a titanium frame, 120Hz OLED display, and all-day battery life.",
        "Cloud providers are expanding data centers to support real-time distributed computing and API endpoints.",
        "Tech startups raised venture funding to build generative AI code generation and automated testing tools.",
        "The software update fixes critical memory leaks and optimizes multi-threaded CPU rendering.",
        "Machine learning models require clean tokenized text and numerical feature embeddings like TF-IDF.",
        "Smart home devices now support Matter protocol for seamless IoT device communication and firmware updates.",
        "Semiconductor manufacturers are building 2nm microchips with enhanced energy efficiency.",
        "Developers are building decentralized web applications using blockchain smart contracts and cryptographic keys.",
        "The new laptop comes equipped with 64GB unified memory and lightning fast NVMe SSD storage.",
        "Researchers published a benchmark comparing transformer language models against recurrent neural networks.",
        "Linux kernel developers merged new patch sets improving kernel scheduling and memory management.",
        "Augmented reality headsets use spatial audio and high-resolution micro-OLED displays.",
        "The backend API was built using FastAPI, PostgreSQL, and asynchronous Python worker queues.",
        "A major telecom carrier launched 5G standalone networks across major metropolitan areas.",
        "Data engineers use Apache Spark and Kafka to process petabytes of real-time streaming data.",
        "Artificial intelligence and deep learning models are revolutionizing automation software.",
    ],
    "Sports": [
        "The national football team won the World Cup championship final in a thrilling penalty shootout.",
        "Manchester United defeated Liverpool with a stunning goal in extra time before 80,000 cheering fans.",
        "The Indian cricket team secured a historic test series victory against Australia on the final day.",
        "The marathon runner shattered the world record by finishing 42 kilometers in under two hours.",
        "The Lakers advanced to the NBA playoffs following an incredible 45-point performance by their star player.",
        "The Olympic swimmer captured two gold medals and set a new world record in the 200m freestyle.",
        "The tennis champion won their twentieth Grand Slam title after a grueling five-set final on center court.",
        "The coach praised the team's defensive discipline, tactical teamwork, and aggressive fast breaks.",
        "Formula 1 drivers battled through heavy rain during the Monaco Grand Prix championship race.",
        "The athlete trained vigorously twice a day ahead of the Commonwealth Games qualifying tournament.",
        "Fans celebrated wildly in the stadium as the striker scored a dramatic hat-trick in the derby match.",
        "The sports league announced the official tournament schedule, playoff brackets, and ticket sales.",
        "The quarterback threw a 50-yard touchdown pass with three seconds remaining on the game clock.",
        "Referees reviewed the VAR footage before awarding a decisive penalty kick in the final minutes.",
        "The boxing champion retained the heavyweight title after a twelve-round unanimous decision.",
        "Cyclists completed the grueling mountain stage of the Tour de France across the steep Alps.",
        "The basketball squad improved their shooting percentage and dominated the offensive rebounds.",
        "The national rugby team lifted the championship trophy after an unbeaten international season.",
        "College athletes competed in the track and field championships across sprint and relay events.",
        "The golf star sank a 20-foot birdie putt on the 18th green to win the prestigious Masters tournament.",
    ],
    "Health": [
        "Medical researchers discovered a promising targeted immunotherapy treatment for advanced cancer patients.",
        "Doctors recommend at least thirty minutes of daily aerobic cardiovascular exercise for heart wellness.",
        "The World Health Organization published new clinical guidelines for managing chronic hypertension and diabetes.",
        "Clinical trials demonstrated that the new antiviral medication significantly reduces hospital recovery time.",
        "Nutritional scientists emphasize that diets rich in leafy greens, whole grains, and omega-3 fatty acids prevent illness.",
        "Surgeons successfully performed a minimally invasive robotic cardiac bypass operation.",
        "Mental health professionals stress the importance of adequate sleep, mindfulness meditation, and stress reduction.",
        "Early diagnostic screening and genetic testing allow oncologists to detect tumors at their earliest stages.",
        "The pediatric hospital launched a vaccination campaign to protect infants against respiratory infections.",
        "Dermatologists warn that daily broad-spectrum sunscreen protection prevents premature skin aging and melanoma.",
        "Neuroscientists mapped neural pathways in the brain to better understand memory loss in Alzheimer's disease.",
        "Pharmaceutical companies are testing a novel antibody drug to treat rheumatoid arthritis and autoimmune disorders.",
        "Patients suffering from chronic insomnia reported significant improvements following cognitive behavioral therapy.",
        "A balanced gut microbiome is essential for optimal digestive health and robust immune system function.",
        "Physical therapists designed rehabilitation routines to help patients recover mobility following knee surgery.",
        "Blood pressure monitoring and low sodium dietary intake help prevent stroke and cardiovascular complications.",
        "The health ministry expanded public health clinics and subsidized essential prescription medicines.",
        "Epidemiologists tracked the transmission dynamics of the viral outbreak to ensure community safety.",
        "Medical imaging technologies like MRI and CT scans provide high-resolution anatomical cross-sections.",
        "Researchers analyzed the biological mechanisms of cellular aging and telomere shortening.",
    ],
    "Finance": [
        "The stock market rose sharply today following favorable inflation data and strong corporate earnings.",
        "Wall Street investors traded billions of shares as tech stocks rallied across major market indices.",
        "The central bank decided to hold benchmark interest rates steady amidst stabilizing consumer price index numbers.",
        "The commercial bank reported record quarterly profits driven by growth in investment banking revenues.",
        "Venture capital firms invested millions into fintech startups developing algorithmic payment processing.",
        "Shareholders approved the multi-billion dollar merger agreement after reviewing the balance sheet valuation.",
        "Cryptocurrency markets experienced volatility as Bitcoin and Ethereum prices fluctuated following regulatory news.",
        "Financial advisors recommend diversifying asset portfolios across equities, sovereign bonds, and index funds.",
        "Corporate earnings reports revealed a 15% annual revenue growth and increased dividend payouts for investors.",
        "Economists forecast that macroeconomic stimulus policies will boost GDP growth and reduce fiscal deficit.",
        "Real estate market valuations softened as 30-year mortgage rates remained elevated near multi-year highs.",
        "The treasury department issued new government debt securities to fund infrastructure expenditures.",
        "Equity analysts upgraded their price targets for retail and energy sector companies based on cash flow projections.",
        "Hedge funds adjusted their portfolio leverage and deployed quantitative arbitrage trading strategies.",
        "Inflation rates declined to target levels as supply chain costs and commodity prices normalized.",
        "The mutual fund posted an annualized return of twelve percent over the past five fiscal years.",
        "Investors analyzed quarterly cash flow statements and debt-to-equity ratios before making capital allocations.",
        "Forex currency traders monitored exchange rate fluctuations between the US Dollar, Euro, and Japanese Yen.",
        "The initial public offering (IPO) on the New York Stock Exchange was oversubscribed by institutional buyers.",
        "Credit rating agencies upgraded the sovereign credit rating to stable following fiscal consolidation reforms.",
    ],
    "Politics": [
        "Parliament passed the landmark national tax reform bill after weeks of intense legislative debate.",
        "The president signed an executive order establishing new environmental standards and renewable energy targets.",
        "Voters head to polling booths across the country next month in a closely contested democratic election.",
        "Diplomats gathered at the international summit to negotiate terms for a multilateral peace treaty.",
        "Opposition party leaders held a press conference calling for greater transparency and government accountability.",
        "The Supreme Court ruled that the constitutional amendment protects individual privacy and voting rights.",
        "The senator introduced bipartisan legislation aimed at strengthening federal cybersecurity and election integrity.",
        "The prime minister reshuffled the cabinet ministers and appointed a new foreign policy secretary.",
        "Lawmakers debated the annual federal budget allocations for education, healthcare, and national defense.",
        "The electoral commission deployed international observers to ensure free and fair election polling.",
        "The governor announced emergency disaster relief funding for flood-affected provincial districts.",
        "Political candidates participated in a televised debate addressing inflation, healthcare costs, and foreign policy.",
        "The treaty was ratified by a two-thirds majority in the senate following diplomatic negotiations.",
        "Citizens gathered outside city hall to protest against the proposed municipal zoning regulations.",
        "The government announced strict anti-corruption legislation and judicial oversight mechanisms.",
        "The ambassador delivered a formal diplomatic note regarding international trade tariffs and maritime borders.",
        "The bipartisan congressional committee published its investigative findings on campaign finance disclosures.",
        "Local municipal council members voted to approve public transit expansion and affordable housing initiatives.",
        "Political analysts discussed voter turnout patterns, swing state demographics, and election polling trends.",
        "The legislative assembly drafted new statutes regulating lobbying practices and ethics standards.",
    ],
    "Entertainment": [
        "The Hollywood director premiered their critically acclaimed new sci-fi movie at the international film festival.",
        "The pop music star released a chart-topping new album that broke global streaming records within 24 hours.",
        "Netflix announced the renewal of its hit drama series for a highly anticipated second season.",
        "Actors and filmmakers celebrated on the red carpet at the Academy Awards Oscar ceremony in Los Angeles.",
        "The rock band kicked off their world stadium tour with a sold-out concert in London before 70,000 fans.",
        "The box office thriller grossed over one hundred million dollars during its opening weekend in theaters.",
        "The singer won three Grammy awards including Album of the Year and Best Pop Solo Performance.",
        "A famous cinema studio released the first official teaser trailer for the upcoming superhero blockbuster sequel.",
        "Critics praised the screenplay, cinematography, musical score, and emotional performances of the lead cast.",
        "The Broadway musical received standing ovations and universal praise from theater critics.",
        "The streaming service launched a documentary series exploring behind-the-scenes stories of famous musicians.",
        "The animation studio revealed concept art and character designs for their upcoming animated family feature film.",
        "Celebrity guests attended the glamorous fashion gala wearing avant-garde designer gowns and couture suits.",
        "The film won the prestigious Palme d'Or award at the Cannes Film Festival after unanimous jury selection.",
        "The television sitcom concluded its tenth and final season with an emotional series finale episode.",
        "Music producers collaborated with electronic artists to produce a vibrant synthesizer-driven pop anthem.",
    ],
    "Education": [
        "The university opened admissions for graduate STEM degree programs and research fellowships.",
        "High school students prepared for standardized college entrance examinations and SAT tests.",
        "The education board introduced an updated science and mathematics curriculum for middle schools.",
        "Online learning platforms expanded access to free university lectures and certified micro-courses.",
        "Professors conducted academic seminars on historical literature, philosophy, and sociological theory.",
        "The ministry of education awarded merit-based scholarships to underprivileged scholars and students.",
        "Classrooms are adopting interactive digital whiteboards and personalized e-learning software.",
        "Researchers published a comprehensive pedagogy study on early childhood literacy and bilingual development.",
        "The engineering college inaugurated a state-of-the-art laboratory for advanced materials research.",
        "Teachers attended professional development workshops focusing on inclusive pedagogy and classroom management.",
        "Students formed collaborative study groups to prepare for final semester comprehensive examinations.",
        "The academic library acquired thousands of digital journals, monographs, and peer-reviewed archives.",
    ],
}

# ==============================================================================
# 2. SENTIMENT CLASSIFICATION
# ==============================================================================
sentiment_data = {
    "Positive": [
        "I absolutely love this product! It has exceeded all my expectations.",
        "Incredible quality and super fast shipping! Highly recommended to everyone.",
        "The customer service team was extremely helpful, polite, and responsive.",
        "Best purchase I have ever made this year, works flawlessly every time.",
        "The user interface is gorgeous, responsive, and wonderfully intuitive.",
        "Five stars! The build quality is top-notch and battery life is outstanding.",
        "I am so impressed with how easy it was to set up and start using.",
        "A truly delightful and satisfying experience from start to finish.",
        "Brilliant engineering and exceptional performance for the price point.",
        "I can't stop smiling, this made my whole day fantastic and joyful.",
        "I'm so grateful for all the support you've given me this year.",
        "Just wanted to say the support team was fantastic and super helpful.",
        "Amazing experience, I would definitely buy again without hesitation.",
        "Super pleased with the result, worth every single penny!",
        "The food was delicious, freshly prepared, and served with a warm smile.",
        "Outstanding craftsmanship and stellar attention to detail.",
    ],
    "Neutral": [
        "The parcel was delivered on Wednesday afternoon around 3:30 PM.",
        "The device measures 15 centimeters in length and weighs 200 grams.",
        "The package arrived in standard cardboard packaging with a shipping label.",
        "The product contains basic plastic components and an instruction manual.",
        "The application requires an active internet connection to synchronize data.",
        "I received an automated confirmation email regarding my submitted inquiry.",
        "The store operates from 9:00 AM to 6:00 PM Monday through Friday.",
        "The software version was updated to 2.4.1 as scheduled in the release notes.",
        "The hotel room was average, containing two beds and a television set.",
        "The battery lasts about six hours under moderate regular usage.",
        "The train departs at platform number three at 10:15 AM.",
        "Please find the attached invoice document for your reference and filing.",
    ],
    "Negative": [
        "The delivery was extremely late and the food arrived completely cold.",
        "Customer support was rude, unhelpful, and hung up on me when I called.",
        "The laptop stopped working after just two days of light use.",
        "Worst customer service I've ever experienced, total waste of money.",
        "The item arrived broken, scratched, and missing key accessories.",
        "Do not buy this! Terrible quality, broke within an hour of opening.",
        "Extremely disappointed with this purchase, complete scam and waste.",
        "The software is full of bugs, constantly crashes, and freezes my computer.",
        "I am furious that they cancelled my flight without any warning.",
        "This traffic jam is driving me insane and making me late for work.",
        "The quality is awful, cheap materials and horrible build standard.",
        "I regret buying this, customer service refused to honor the warranty.",
        "Terrible experience, they charged hidden fees without my consent.",
        "The screen flickers constantly and makes high pitched buzzing noises.",
    ],
}

# ==============================================================================
# 3. SPAM DETECTION
# ==============================================================================
spam_data = {
    "Spam": [
        "CONGRATULATIONS! You have been selected as the WINNER of $1,000,000 cash! Claim now at http://prize-win.xyz",
        "URGENT: Your bank account has been suspended! Verify your password immediately: http://secure-login-bank.top",
        "Lose 20 pounds in 3 days with this secret miracle diet pill! Risk free trial!",
        "Double your Bitcoin in 24 hours guaranteed! Send 0.1 BTC to receive 0.5 BTC instantly!",
        "HOT singles in your area want to chat with you right now! Click here to view private photos!",
        "Dear beneficiary, claim your $5,500,000 inheritance from the late royalty fund today.",
        "You have 1 unread urgent voicemail message regarding your pending tax refund. Call 1-900-555-SPAM.",
        "Get pre-approved for an instant $50,000 low interest loan with ZERO credit check needed!",
        "BUY cheap luxury watches, Rolex replica 90% discount sale ends today!",
        "Work from home and earn $5,000 per week with just 30 minutes of online data entry!",
        "Final notice: Your car warranty has expired. Press 1 to renew immediately.",
        "Free Amazon $500 gift card reward! Enter your phone number and credit card to claim.",
    ],
    "Not Spam": [
        "Hey, are we still meeting for lunch at the cafeteria at 12:30 today?",
        "Attached is the weekly project progress report for your team review.",
        "Hi Mom, I arrived safely at the hotel and will call you in the evening.",
        "Your doctor's appointment is confirmed for Thursday, October 12th at 2:00 PM.",
        "Can you please review the attached slide deck before our client presentation?",
        "Your monthly electric utility bill of $78.50 is ready to view online.",
        "Thanks for sending over the meeting minutes, I will review them tonight.",
        "The university library books you borrowed are due next Monday.",
        "Let me know if you need any assistance preparing the budget spreadsheet.",
        "Your flight ticket confirmation code is XY892K for flight AA-104.",
        "Here is the recipe for the pasta dish we made last weekend.",
        "Please find the updated project milestones and timeline schedule attached.",
    ],
}

# ==============================================================================
# 4. INTENT CLASSIFICATION
# ==============================================================================
intent_data = {
    "Inquiry": [
        "I'd like to book a table for four people this Saturday evening.",
        "I'd like to schedule an appointment with a specialist next week.",
        "Can you tell me what your opening hours are on weekends?",
        "Is it possible to upgrade my current plan to the premium tier?",
        "How much does the annual subscription plan cost for enterprise teams?",
        "Do you offer international shipping to Canada and the United Kingdom?",
        "Can I reserve a conference room for our team meeting on Friday at 3 PM?",
        "What payment methods do you accept on your online checkout page?",
        "Could you tell me if this winter jacket comes in size extra large?",
        "I want to check availability for hotel rooms between Dec 10 and Dec 15.",
        "What are the system requirements for running this software on Mac?",
        "How do I book a private consultation session with an advisor?",
        "Do you have vegan and gluten-free options available on your dinner menu?",
        "Is there a free trial available for new users before purchasing?",
        "Can you provide more information about your warranty coverage policy?",
        "I want to make a reservation for two guests at 7:30 PM tonight.",
    ],
    "Complaint": [
        "I'm writing to complain about the poor quality of the item I received.",
        "The delivery was three hours late and the food was completely cold.",
        "The service staff was extremely rude and unhelpful when I asked for assistance.",
        "I am very unhappy with the substandard service provided by your company.",
        "The product stopped working after two days, this is completely unacceptable.",
        "I have been waiting on hold for 45 minutes without anyone answering my call.",
        "Your technician did a terrible job and damaged my home wiring.",
        "The room was dirty, noisy, and had no hot water during our entire stay.",
        "I received the wrong item in my package and nobody is responding to my emails.",
        "This is the worst customer experience I have ever endured.",
    ],
    "Feedback": [
        "Just wanted to say the support team was fantastic and super helpful!",
        "I wanted to leave positive feedback for Sarah who helped me resolve my issue.",
        "Your application is amazing, keep up the wonderful work!",
        "I have a suggestion to improve the user interface on the settings page.",
        "Thank you for the quick resolution, 5-star customer support experience!",
        "I really love the new dark mode theme update you recently rolled out.",
        "Kudos to your delivery driver who was polite, punctual, and very professional.",
        "I wanted to share some feedback regarding your recent software release.",
        "Great job on the new features, they saved our team hours of work.",
    ],
    "Order Tracking": [
        "What is the status of my order that I placed three days ago?",
        "Where is my package right now? Tracking number is TRK-881920.",
        "Can you check the current shipping location of order number #77102?",
        "The tracking number says out for delivery, what time will the courier arrive?",
        "I want to track the live real-time location of my package in transit.",
        "Could you tell me which courier service is handling the delivery of my parcel?",
        "I have not received any tracking updates for shipment #9084.",
        "When will my order arrive at my doorstep?",
        "Has my order #44910 been dispatched from the fulfillment warehouse yet?",
        "I need the tracking URL and consignment number for my recent purchase.",
    ],
    "Refund": [
        "I want a refund for the product since it arrived damaged.",
        "Please issue a full refund back to my credit card immediately.",
        "I returned the item to your store, when will my refund be credited?",
        "I was charged twice for the same transaction, please refund the duplicate fee.",
        "The product did not match the website description, I demand my money back.",
        "I would like to request a 100% money-back refund under your return policy.",
        "How long does it take for a bank account refund to process?",
        "Please refund the unauthorized subscription charge on my debit card.",
        "I want my cashback and purchase price refunded for this broken keyboard.",
    ],
    "Cancellation": [
        "I want to cancel my subscription effective immediately.",
        "Please cancel my monthly premium plan and stop all future recurring billing.",
        "I would like to cancel order #99401 before it gets shipped from the warehouse.",
        "Please terminate my membership and delete my account.",
        "I want to cancel my flight reservation and void the airline ticket.",
        "How can I cancel my gym membership without paying a cancellation fee?",
        "Please abort this order processing, I made a mistake and wish to cancel.",
        "Cancel my subscription before the free trial period ends.",
        "Please void this transaction and cancel my pending order right away.",
    ],
    "Technical Support": [
        "Could you help me reset my account password?",
        "I cannot log into my account, it keeps saying invalid credentials.",
        "The mobile app crashes with error 500 whenever I click export.",
        "My API authentication token is failing with 401 unauthorized error.",
        "The screen turns completely blank and white after the recent update.",
        "I am getting a database connection timeout error on the server.",
        "How do I configure the SMTP email settings in the dashboard?",
        "The Bluetooth device will not pair with my laptop despite restarting.",
        "The webcam driver is not detected during video conferencing calls.",
        "How do I clear the browser cache and cookies to fix rendering glitches?",
    ],
}

# ==============================================================================
# 5. EMOTION CLASSIFICATION
# ==============================================================================
emotion_data = {
    "Joy": [
        "I can't stop smiling, today is such a wonderful and glorious day!",
        "Smiling from ear to ear right now, feeling so happy and overjoyed!",
        "I am so grateful for all the support you've given me this year.",
        "That surprise party left me completely speechless and overjoyed.",
        "Yay, we achieved our goal and won first place in the tournament!",
        "Feeling fantastic, energetic, and full of positive vibes and bliss!",
        "I am delighted and thrilled with these incredible results.",
        "Such a joyous, cheerful, and uplifting celebration with my loved ones.",
        "Fantastic achievement, I am overjoyed and so proud of everyone.",
        "I feel alive, blessed, and full of pure happiness, smiles, and joy.",
        "Super excited for the weekend trip, can't wait to celebrate!",
        "Life is beautiful, feeling peaceful, contented, and full of happiness.",
        "I am so proud of my accomplishments, this is truly a dream come true.",
        "Best day of my life, celebrating with my friends and family!",
    ],
    "Sadness": [
        "I feel so lonely and heartbroken since she moved away.",
        "I miss my family so much during the holidays, feeling so lonely.",
        "I feel so sad, hopeless, and depressed today.",
        "My heart is broken and I can't stop crying alone in my dark room.",
        "Deeply grieving the painful loss of my dearest beloved pet.",
        "It is so depressing, devastating, and heartbreaking to see this happen.",
        "Feeling down in the dumps, empty, gloomy, and completely miserable.",
        "A sorrowful and agonizing situation that fills me with grief and tears.",
        "Disappointed with myself, feeling like an absolute failure and burden.",
        "Tears in my eyes, feeling completely shattered, rejected, and crushed.",
        "I feel so helpless, abandoned, and isolated from everyone around me.",
        "Nothing brings me comfort anymore, just deep emotional sorrow and pain.",
    ],
    "Anger": [
        "I'm furious that they cancelled my flight without any warning.",
        "This traffic jam is driving me insane and making me lose my mind!",
        "I am absolutely furious and raging mad at this blatant injustice!",
        "This makes my blood boil, how dare they treat paying customers like this!",
        "I hate this so much, it is completely unacceptable, rude, and offensive!",
        "Stop lying to me, I am so angry, annoyed, and irritated right now!",
        "Disgusted and outraged by this terrible, disrespectful behavior!",
        "I am so frustrated and pissed off with this extreme incompetence!",
        "This is outrageous, I demand an immediate explanation right now!",
        "I am losing my temper and cannot tolerate this insulting rubbish anymore.",
        "Fuming with rage, this dishonest cheat ruined everything for us.",
        "Utterly infuriated by their pathetic, arrogant, and rude customer service.",
    ],
    "Fear": [
        "I'm terrified about the results of my medical test tomorrow.",
        "I'm nervous about my job interview scheduled for tomorrow morning.",
        "I am terrified and scared for my physical safety and wellbeing.",
        "This is so creepy, scary, and dangerous, I am completely panicked.",
        "Feeling extreme anxiety, nervous dread, and horror about what will happen.",
        "Trembling with sheer fear, my hands are shaking uncontrollably from panic.",
        "A terrifying nightmare that frightened all of us to the bone.",
        "Scared to death of the dark alley and the strange stalking footsteps.",
        "Urgent threat warning, please take shelter immediately from the danger.",
        "The risk is horrifying, I am in total shock and petrified with anxiety.",
        "I dread opening this notice, my heart is pounding with pure fear.",
        "An unsettling, eerie atmosphere that filled me with dread and terror.",
    ],
    "Surprise": [
        "Wow, I cannot believe this actually happened out of nowhere!",
        "Wow!",
        "I am completely shocked, stunned, and astonished by this discovery!",
        "What a sudden and unexpected pleasant surprise this morning!",
        "My jaw literally dropped when I opened the secret gift box!",
        "Incredible, I was not anticipating this mind-blowing twist at all!",
        "Speechless! This is utterly bewildering, startling, and astonishing.",
        "Never in a million years did I see that unexpected outcome coming!",
        "Unbelievable turn of events that took everyone completely by surprise.",
        "I was blown away by how extraordinarily different it turned out.",
        "Oh my goodness, what a shocking, unbelievable revelation!",
    ],
    "Love": [
        "I love you with all my heart, soul, and endless deep affection.",
        "You are my absolute favorite person in the entire world, my darling.",
        "Adoring every single sweet moment spent together with you.",
        "Such a sweet, lovely, and precious treasure in my life.",
        "Cherishing this beautiful, tender, and unforgettable romance.",
        "My heart belongs to you forever, completely head over heels in love.",
        "Sending you warm hugs, gentle kisses, and lots of unconditional love.",
        "You mean everything to me, absolutely adorable, sweet, and charming.",
        "Deeply devoted and enamored by your warmth, love, and kindness.",
        "Forever grateful for your unconditional love, affection, and care.",
    ],
    "Neutral": [
        "The meeting is scheduled for tomorrow afternoon in conference room B.",
        "The file has been saved to the designated folder on the local drive.",
        "The temperature outside is 20 degrees Celsius with moderate wind.",
        "The train arrives on platform four at quarter past five.",
        "The report contains twenty pages of tabular financial data.",
        "Please find the PDF document attached for your records and review.",
        "The standard protocol was followed according to the operating manual.",
        "The vehicle has four doors, standard tires, and a steering wheel.",
        "The store is open from 9 AM to 6 PM on business weekdays.",
        "The box dimensions are thirty centimeters wide and fifty centimeters high.",
    ],
}


def expand_dataset(base_data, multiplier=12):
    """
    Expands base dataset rows with contextual variations, prefixes, suffixes,
    and realistic linguistic modifiers to create hundreds of high-quality training examples.
    """
    prefixes = [
        "", "Please note: ", "Hello, ", "Hi, ", "Quick note: ", "FYI: ",
        "Update: ", "Notice: ", "Important: ", "Urgent: ", "Hey support team, ",
        "To whom it may concern, ", "Good morning, ", "Good afternoon, ", "Dear team, ",
        "Honestly, ", "Actually, ", "In my opinion, ",
    ]
    suffixes = [
        "", " Thanks.", " Thank you so much.", " Please assist.", " Let me know asap.",
        " What do you suggest?", " Looking forward to hearing back.", " Appreciate your help.",
        " This is critical.", " Please respond soon.", " Best regards.",
    ]
    
    rows = []
    for label, samples in base_data.items():
        # First include the exact clean base samples multiple times to strongly anchor priors
        for s in samples:
            rows.append((s, label))
            rows.append((s.lower(), label))
            
        # Create diverse syntactic and lexical variations
        for s in samples:
            for _ in range(multiplier):
                p = random.choice(prefixes)
                suf = random.choice(suffixes)
                text_variant = s
                if random.random() < 0.25:
                    text_variant = text_variant.lower()
                
                combo = f"{p}{text_variant}{suf}".strip()
                rows.append((combo, label))
                
    random.shuffle(rows)
    return rows


def write_csv(filename, rows):
    path = os.path.join(OUT_DIR, filename)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["text", "label"])
        for text, label in rows:
            writer.writerow([text, label])
    print(f"Wrote {len(rows)} rows to {path}")


def main():
    print("Generating comprehensive datasets for TextLab...")
    
    # 1. Topic
    topic_rows = expand_dataset(topics_data, multiplier=12)
    write_csv("topic_dataset.csv", topic_rows)
    
    # 2. Sentiment
    sentiment_rows = expand_dataset(sentiment_data, multiplier=14)
    write_csv("sentiment_dataset.csv", sentiment_rows)
    
    # 3. Spam
    spam_rows = expand_dataset(spam_data, multiplier=14)
    write_csv("spam_dataset.csv", spam_rows)
    
    # 4. Intent
    intent_rows = expand_dataset(intent_data, multiplier=12)
    write_csv("intent_dataset.csv", intent_rows)
    
    # 5. Emotion
    emotion_rows = expand_dataset(emotion_data, multiplier=12)
    write_csv("emotion_dataset.csv", emotion_rows)
    
    print("Dataset generation complete!")


if __name__ == "__main__":
    main()
