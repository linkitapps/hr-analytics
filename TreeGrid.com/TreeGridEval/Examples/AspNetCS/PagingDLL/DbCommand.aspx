<%@ Import Namespace="System.Runtime.InteropServices" %>
<script language="c#" runat="server">
   // --------------------------------------------------------------------------------
   // By default (false) it uses SQLite database (Database.db). You can switch to MS Access database (Database.mdb) by setting UseMDB = true 
   // The SQLite loads dynamically its DLL from TreeGrid distribution, it chooses 32bit or 64bit assembly
   // The MDB can be used only on 32bit IIS mode !!! The ASP.NET service program must have write access to the Database.mdb file !!!
   bool UseMDB = false;
   // --------------------------------------------------------------------------------
   void Page_Init(object sender, System.EventArgs e)
   {
      Init();
   }
   // -----------------------------------------------------------------------------------------------------
   void Page_Load(object sender, System.EventArgs e)
   {

      // --- Response initialization ---
      Response.ContentType = "text/xml";
      Response.Charset = "utf-8";
      Response.AppendHeader("Cache-Control", "max-age=1, must-revalidate");
      System.Threading.Thread.CurrentThread.CurrentCulture = System.Globalization.CultureInfo.CreateSpecificCulture("en-US");
      if (!Loaded) { Response.Write(Error(-5, "TreeGrid.dll not found or cannot be loaded")); return; }

      // --- Function switch ---
      string F = Request.Params["Function"];
      if (F == "LoadBody") Response.Write(FuncLoadBody(Request.Params["Table"], Request.Params["Def"], Request.Params["Data"], Request.Params["Bonus"]));
      else if (F == "LoadPage") Response.Write(FuncLoadPage(Request.Params["Table"], Request.Params["Def"], Request.Params["Data"], Request.Params["Bonus"]));
      else if (F == "Save") Response.Write(FuncSave(Request.Params["Table"], Request.Params["Def"], Request.Params["Data"], Request.Params["Bonus"]));
      else if (F == "Export") Response.Write(FuncExport(Request.Params["Table"], Request.Params["Def"], Request.Params["Data"], Request.Params["Bonus"]));
      else Response.Write(Error(-3, "Wrong function requested"));
   }
   // ----------------------------------------------------------------------------------------------------
   // Inicialization and TreeGrid.dll loading
   void Init()
   {
      Path = System.IO.Path.GetDirectoryName(Context.Request.PhysicalPath) + "\\";
      Loaded = LoadLibrary(Path + "..\\..\\..\\Server\\" + (IntPtr.Size == 4 ? "" : "DLL64\\") + "TreeGrid.dll") != IntPtr.Zero;
   }
   // ----------------------------------------------------------------------------------------------------
   string Path; // Path to data directory
   bool Loaded; // If DLL successfuly loaded
   System.Data.IDbConnection Conn; // Connection to database
   // ----------------------------------------------------------------------------------------------------
   // TreeGrid.dll import
   [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
   static extern IntPtr LoadLibrary(string lpFileName);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int CreateGrid(string Data, string Layout, string Defaults, string Text, string Bonus, string Bonus2);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int UpdateGrid(int Index, string Bonus);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int FindGrid(string Cfg);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int FindGrids(IntPtr Indexes, int Max, string Cfg, int Seconds, int Type);
   public static int FindGrids(ref int[] Indexes, int Max, string Cfg, int Seconds, int Type)
   {
      return FindGrids(GCHandle.Alloc(Indexes, GCHandleType.Pinned).AddrOfPinnedObject(), Max, Cfg, Seconds, Type);
   }
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetSession(string Cfg);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetGridSession(int Index);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int DeleteGrid(int Index);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern void Clear();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetBody(int Index, string Cfg);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetPage(int Index, string Cfg);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetExport(int Index, string Cfg);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int Save(int Index, string Input);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int SaveEx(int Index, string Input, int Type);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int SaveToFile(int Index, string FileName, int Type);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetData(int Index);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetLastId(int Index);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string GetChanges(int Index, int Type);
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern void EnterWrite();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern void LeaveWrite();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern void EnterRead();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern void LeaveRead();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int SetLocale(int Index, string Locale);

   // --- Debug version only ---   
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern string LastError();
   [DllImport("TreeGrid.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
   public static extern int SetDebug(int Debug, string File);
   // ----------------------------------------------------------------------------------------------------


   // ----------------------------------------------------------------------------------------------------
   // Returns Xml with given error message
   private string Error(int num, string mess)
   {
      string Err = num != 0 && Loaded ? LastError() : null;
      if (Err != null) mess = mess + "&#x0A;&#x0A;" + Err.Replace("&", "&amp;").Replace("<", "&lt;").Replace("\"", "&quot;");
      return "<Grid><IO Result='" + num + "' Message=\"" + mess + "\"/></Grid>";
   }
   // ----------------------------------------------------------------------------------------------------
   // Returns create SqlCommand
   private System.Data.IDbCommand InitDB()
   {
      
      if (UseMDB) // For MS Acess database
      {
         Conn = new System.Data.OleDb.OleDbConnection("Data Source=\"" + Path + "\\..\\Database.mdb\";Mode=Share Deny None;Jet OLEDB:Global Partial Bulk Ops=2;Jet OLEDB:Registry Path=;Jet OLEDB:Database Locking Mode=1;Jet OLEDB:Engine Type=5;Provider=\"Microsoft.Jet.OLEDB.4.0\";Jet OLEDB:System database=;Jet OLEDB:SFP=False;persist security info=False;Extended Properties=;Jet OLEDB:Compact Without Replica Repair=False;Jet OLEDB:Encrypt Database=False;Jet OLEDB:Create System Database=False;Jet OLEDB:Don't Copy Locale on Compact=False;User ID=Admin;Jet OLEDB:Global Bulk Transactions=1");
      }
      else // For SQLite database
      {
         System.Reflection.Assembly SQLite = System.Reflection.Assembly.LoadFrom(Path + "\\..\\..\\..\\Server\\SQLite" + (IntPtr.Size == 4 ? "32" : "64") + "\\System.Data.SQLite.DLL");
         Conn = (System.Data.IDbConnection)Activator.CreateInstance(SQLite.GetType("System.Data.SQLite.SQLiteConnection"), "Data Source=" + Path + "\\..\\Database.db");
      }
      Conn.Open();
      return Conn.CreateCommand();
   }
   // ----------------------------------------------------------------------------------------------------
   // Returns Grids index for given file or <0 for error
   private int GetIndex(string Table, string Def, string Cfg, string Bonus)
   {
      if (Table == "") return -1;
      int Index = FindGrid(Cfg);
      if (Index >= 0) return Index;
      string file = Path + "tmp\\" + GetSession(Cfg) + ".xml";
      if (System.IO.File.Exists(file)) return CreateGrid(file, Path + Def, Path + "..\\..\\..\\Grid\\Defaults.xml", Path + "..\\..\\..\\Grid\\Text.xml", Bonus, null);

      // --- Loading data from database ---
      System.Data.IDbCommand Cmd = InitDB();
      Cmd.CommandText = "SELECT * FROM " + Table;
      System.Data.IDataReader R = Cmd.ExecuteReader();
      StringBuilder S = new StringBuilder();
      S.Append("<Grid><Body><B>");
      while (R.Read())
      {
         S.Append("<I id='" + R[0].ToString() + "'"
            + " Project='" + R[1].ToString().Replace("&", "&amp;").Replace("'", "&apos;").Replace("<", "&lt;") + "'"
            + " Resource='" + R[2].ToString().Replace("&", "&amp;").Replace("'", "&apos;").Replace("<", "&lt;") + "'"
            + " Week='" + R[3].ToString() + "'"
            + " Hours='" + R[4].ToString() + "'"
            + "/>");
      }
      S.Append("</B></Body></Grid>");
      R.Close();
      Conn.Close();

      // --- Creates grid from data ---
      return CreateGrid(S.ToString(), Path + Def, Path + "..\\..\\..\\Grid\\Defaults.xml", Path + "..\\..\\..\\Grid\\Text.xml", Bonus, null);
   }
   // ----------------------------------------------------------------------------------------------------
   // Returns grid data, for Paging==3 returns only empty pages with information about their content
   // Data contains XML with grid settings - sorting and filters
   private string FuncLoadBody(string File, string Def, string Data, string Bonus)
   {
      int Index = GetIndex(File, Def, Data, Bonus);
      if (Index < 0) return Error(-1, "Server DLL Error: TreeGrid data not found or server has not permission to read them&#x0A;Data are located at " + Path + File);
      string Ret = GetBody(Index, Data);
      if (Ret == null) return Error(-4, "Server DLL Error: TreeGrid data cannot be loaded");
      SaveToFile(Index, Path + "tmp\\" + GetGridSession(Index) + ".xml", 28);
      return Ret;
   }
   // ----------------------------------------------------------------------------------------------------
   // Returns children of one page or one row
   // Data contains XML with page index or row id and grid settings - sorting and filters
   private string FuncLoadPage(string File, string Def, string Data, string Bonus)
   {
      int Index = GetIndex(File, Def, Data, Bonus);
      if (Index < 0) return Error(-1, "Server DLL Error: TreeGrid data not found");
      string Ret = GetPage(Index, Data);
      if (Ret == null) return Error(-3, "Server DLL Error: Configuration changed, you need to reload grid!");
      return Ret;
   }
   // ----------------------------------------------------------------------------------------------------
   // Saves changed data to XML file
   // Data contains XML with changed rows
   private string FuncSave(string File, string Def, string Data, string Bonus)
   {

      // --- Save changes to DLL ---
      int Index = GetIndex(File, Def, Data, Bonus);
      if (Index < 0) return Error(-1, "Server DLL Error: TreeGrid data not found");
      int Ret = Save(Index, Data);
      if (Ret < 0) return Error(Ret, "Server DLL Error: Changes were not saved");
      SaveToFile(Index, Path + "tmp\\" + GetGridSession(Index) + ".xml", 28);

      // --- Save changes to database ---
      System.Data.IDbCommand Cmd = InitDB();
      System.Xml.XmlDocument X = new System.Xml.XmlDocument();
      X.LoadXml(HttpUtility.HtmlDecode(Data));
      System.Xml.XmlNodeList Ch = X.GetElementsByTagName("Changes");
      if (Ch.Count > 0) foreach (System.Xml.XmlElement I in Ch[0])
         {
            string SQL = "";
            string id = I.GetAttribute("id");

            if (I.GetAttribute("Deleted") == "1") SQL = "DELETE FROM " + File + " WHERE ID=" + id;
            else if (I.GetAttribute("Added") == "1")
            {
               SQL = "INSERT INTO " + File + "(ID,Project,Resource,Week,Hours) VALUES("
                  + id + ","
                  + "'" + I.GetAttribute("Project").Replace("'", "''") + "',"
                  + "'" + I.GetAttribute("Resource").Replace("'", "''") + "',"
                  + I.GetAttribute("Week") + ","
                  + I.GetAttribute("Hours") + ")";
            }
            else if (I.GetAttribute("Changed") == "1")
            {
               SQL = "UPDATE " + File + " SET ";
               for (int idx = 0; idx < I.Attributes.Count; idx++)
               {
                  System.Xml.XmlAttribute A = I.Attributes[idx];
                  if (A != null)
                  {
                     string name = A.Name;
                     string val = A.Value;
                     if (name == "Project" || name == "Resource") SQL += name + " = '" + val.Replace("'", "''") + "',";
                     else if (name == "Week" || name == "Hours") SQL += name + " = " + val + ",";
                  }
               }
               SQL = SQL.TrimEnd(",".ToCharArray()); // Last comma away
               SQL += " WHERE ID=" + id;
            }
            Cmd.CommandText = SQL;
            Cmd.ExecuteNonQuery();
         }
      Conn.Close();
      if (Ret > 0) return Error(0, "Warning: Not all data were successfully saved !");
      return Error(0, "");
   }
   // ----------------------------------------------------------------------------------------------------
   // Returns the whole grid in XLS/HTML
   private string FuncExport(string File, string Def, string Data, string Bonus)
   {
      int Index = GetIndex(File, Def, Data, Bonus);
      if (Index < 0) return "Server DLL Error: TreeGrid data not found";
      string Ret = GetExport(Index, Data);
      if (Ret == null) return "Server DLL Error: Configuration changed, you need to reload grid!";
      Response.AppendHeader("Content-Disposition", "attachment; filename=\"Grid.xls\"");
      Response.ContentType = "application/vnd.ms-excel";
      return Ret;
   }
   // -----------------------------------------------------------------------------------------------------
</script>
