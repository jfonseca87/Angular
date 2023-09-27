using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web.Http;
using Microsoft.Reporting.WebForms;

namespace WebAPIPrueba.Controllers
{
    [Authorize]
    public class TestController : ApiController
    {
        
        [HttpGet]
        public IHttpActionResult LoginServerReport()
        {
            try
            {
                var user = User.Identity.Name;

                ReportViewer reportViewer = new ReportViewer();
                ReportParameter[] parameters = new ReportParameter[] {
                    new ReportParameter("IdFactura", "1")
                };

                string UserName = "rcaballero";
                string Password = "Redesis2011$";
                string Domain = "Redesis";

                IReportServerCredentials irsc = new CustomReportCredentials(UserName, Password, Domain);

                reportViewer.ProcessingMode = ProcessingMode.Remote;
                reportViewer.AsyncRendering = false;
                reportViewer.ServerReport.ReportServerCredentials = irsc;
                reportViewer.ServerReport.ReportServerUrl = new Uri("http://200.253.1.82/ReportServer_WEBFLOR");
                reportViewer.ServerReport.ReportPath = "/WebFlorDespacho/rptFactura";
                reportViewer.ServerReport.SetParameters(parameters);
                // reportViewer.ServerReport.Refresh();

                return Ok();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

    public class CustomReportCredentials : IReportServerCredentials
    {
        private string _UserName;
        private string _PassWord;
        private string _DomainName;

        public CustomReportCredentials(string UserName, string PassWord, string DomainName)
        {
            _UserName = UserName;
            _PassWord = PassWord;
            _DomainName = DomainName;
        }

        public WindowsIdentity ImpersonationUser
        {
            get
            {
                return null;  // not use ImpersonationUser
            }
        }
        public ICredentials NetworkCredentials
        {
            get
            {

                // use NetworkCredentials
                return new NetworkCredential(_UserName, _PassWord, _DomainName);
            }
        }
        public bool GetFormsCredentials(out Cookie authCookie, out string user, out string password, out string authority)
        {

            // not use FormsCredentials unless you have implements a custom autentication.
            authCookie = null;
            user = password = authority = null;
            return false;
        }
    }
}
