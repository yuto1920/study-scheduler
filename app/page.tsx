"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Cpu, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Study Scheduler
        </div>
        <nav className="flex items-center gap-6 font-medium">
          <Link href="#features" className="hover:text-indigo-500 transition">機能</Link>
          <Link href="#pricing" className="hover:text-indigo-500 transition">料金</Link>
          <Link href="/dashboard/upload" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
            無料で試す
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          AIがあなたの学習をパーソナライズ
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          授業資料を入れるだけ。<br/>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AIが学習計画とテストを自動生成。
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          大学のPDFやスライドをアップロードし、Googleカレンダーと連携するだけで、
          試験までの最適なスケジュールと弱点克服のためのクイズをAIが作成します。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard/upload" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-indigo-700 hover:scale-105 transition transform shadow-xl shadow-indigo-500/30">
            さっそく無料で始める <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard/upload" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 text-lg font-bold px-8 py-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            サインアップ
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-black py-24 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            なぜ Study Scheduler なのか？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">資料から瞬時に要約抽出</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                PDFやPowerPointをドロップするだけで、AIが講義の要点と試験に出やすいキーワードを自動的に抽出します。
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">カレンダー連携で無理なく</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Googleカレンダーの空き時間を分析し、アルバイトやサークルを圧迫しない、実現可能な学習スケジュールを組み立てます。
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI生成クイズで弱点克服</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                講義内容に沿った確認テスト（多肢選択式）を何度でも生成。間違えた箇所の解説を読み、確実に知識を定着させます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          シンプルな料金プラン
        </h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-500 mb-6">まずは無料で基本機能を試す</p>
            <div className="text-4xl font-extrabold mb-8">¥0<span className="text-lg text-gray-500 font-medium"> / 月</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> 資料アップロード 3ファイルまで</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> スケジュール生成 1週間分</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /> クイズ生成 月10回まで</li>
            </ul>
            <Link href="/dashboard/upload" className="block text-center w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              無料で始める
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900 to-black text-white border border-indigo-500/30 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-3xl">一番人気</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-indigo-200 mb-6">全ての機能を無制限で使い倒す</p>
            <div className="text-4xl font-extrabold mb-8">¥980<span className="text-lg text-indigo-300 font-medium"> / 月</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-400" /> 資料アップロード 無制限</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-400" /> スケジュール生成 無制限</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-400" /> クイズ生成 無制限</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-400" /> 優先的なAI生成スピード</li>
            </ul>
            <button className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/25">
              Proプランに登録する
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500">
        <p>© 2026 Study Scheduler. All rights reserved.</p>
      </footer>

    </div>
  );
}
