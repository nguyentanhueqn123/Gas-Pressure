// Cấu hình Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAUC10eMF8FlShIHAcMsTQonrVfDdtrcRE',
  authDomain: 'bvgd-835da.firebaseapp.com',
  databaseURL:
    'https://bvgd-835da-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'bvgd-835da',
  storageBucket: 'bvgd-835da.firebasestorage.app',
  messagingSenderId: '253705970424',
  appId: '1:253705970424:web:558fccce89deacc84a110d',
  measurementId: 'G-7FVXENSD2K',
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Danh sách cảm biến theo thứ tự
const sensorIds = [
  'oxyL',
  'oxyM',
  'oxyR', // Oxygen: 0, 1, 2
  'nitroL',
  'nitroM',
  'nitroR', // Nitrogen: 3, 4, 5
  'co2L',
  'co2M',
  'co2R', // Carbon Dioxide: 6, 7, 8
  'mixL',
  'mixM',
  'mixR', // Mix: 9, a, b
];

// Danh sách key trong Firebase
const firebaseKeys = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
];

// Lấy dữ liệu từ Firebase khi có thay đổi
database.ref('/s').on('value', function (snapshot) {
  let data = snapshot.val();

  if (data) {
    firebaseKeys.forEach((key, index) => {
      let elementId = sensorIds[index];
      let value = data[key] !== undefined ? data[key] : '--'; // Nếu không có giá trị, hiển thị "--"
      document.getElementById(elementId).innerHTML = value + ' PSI';
    });
  }
});

// Lấy dữ liệu lỗi và xử lý hiệu ứng chớp đỏ
database.ref('/f').on('value', function (snapshot) {
  let errorFlags = snapshot.val();
  let hasError = false;

  for (let i = 0; i < 12; i++) {
    let sensorElement = document.getElementById(sensorIds[i]);
    if ((errorFlags >> i) & 1) {
      sensorElement.classList.add('error'); // Bật hiệu ứng chớp đỏ
      hasError = true;
    } else {
      sensorElement.classList.remove('error'); // Tắt hiệu ứng nếu không có lỗi
    }
  }

  // Kích hoạt âm báo khi có lỗi
  if (hasError) {
    playAlarm();
  } else {
    stopAlarm();
  }
});

var audio = new Audio('alarm.mp3'); // Đường dẫn file âm thanh
var userInteracted = false; // Cờ kiểm tra xem người dùng đã tương tác chưa

// Gọi hàm này khi người dùng click vào nút hoặc màn hình
function enableAudio() {
  userInteracted = true;
  audio
    .play()
    .catch((error) =>
      console.log('Không thể phát âm thanh ngay lập tức:', error)
    );
}

// Gọi hàm này khi có lỗi
function playAlarm() {
  if (userInteracted) {
    audio.loop = true;
    audio.play().catch((error) => console.log('Lỗi phát âm:', error));
  }
}

// Gọi hàm này để dừng âm thanh
function stopAlarm() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Khi trang tải xong, thêm sự kiện để phát âm khi nhấp vào màn hình
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });
