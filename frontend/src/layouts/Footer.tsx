export default function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer className="w-full h-max pb-20 text-center text-sm text-slate-500">
      <p>Copyright {date} © tsukiwa. All rights reserved.</p>
    </footer>
  );
}
